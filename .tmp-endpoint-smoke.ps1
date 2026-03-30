$ErrorActionPreference = "Stop"
$base = "http://localhost:8000/api"
$session = New-Object Microsoft.PowerShell.Commands.WebRequestSession
$results = New-Object System.Collections.Generic.List[object]

function Add-Result([string]$name, [bool]$ok, [string]$detail) {
    $results.Add([PSCustomObject]@{ Endpoint = $name; Status = $(if ($ok) { "PASS" } else { "FAIL" }); Detail = $detail })
}

function Invoke-Json {
    param(
        [string]$Name,
        [string]$Method,
        [string]$Uri,
        [hashtable]$Headers,
        [object]$Body = $null,
        [switch]$UseSession
    )

    try {
        if ($Body -ne $null) {
            $json = $Body | ConvertTo-Json -Depth 10
            if ($UseSession) {
                $resp = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -Body $json -ContentType "application/json" -WebSession $session
            } else {
                $resp = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -Body $json -ContentType "application/json"
            }
        } else {
            if ($UseSession) {
                $resp = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers -WebSession $session
            } else {
                $resp = Invoke-RestMethod -Method $Method -Uri $Uri -Headers $Headers
            }
        }
        Add-Result $Name $true "HTTP 2xx"
        return $resp
    } catch {
        $msg = $_.Exception.Message
        Add-Result $Name $false $msg
        return $null
    }
}

# Auth
$loginBody = @{ email = "admin@blf.com"; password = "admin123" }
$login = Invoke-Json -Name "POST /auth/login" -Method "POST" -Uri "$base/auth/login" -Headers @{} -Body $loginBody -UseSession
if (-not $login) {
    $results | Format-Table -AutoSize | Out-String | Write-Output
    exit 1
}
$token = $login.access_token
$headers = @{ Authorization = "Bearer $token" }

$me = Invoke-Json -Name "GET /auth/me" -Method "GET" -Uri "$base/auth/me" -Headers $headers
$users = Invoke-Json -Name "GET /auth/users" -Method "GET" -Uri "$base/auth/users" -Headers $headers

$refresh = Invoke-Json -Name "POST /auth/refresh" -Method "POST" -Uri "$base/auth/refresh" -Headers @{} -UseSession
$logout = Invoke-Json -Name "POST /auth/logout" -Method "POST" -Uri "$base/auth/logout" -Headers @{} -UseSession
# Login again for remaining calls
$login2 = Invoke-Json -Name "POST /auth/login (again)" -Method "POST" -Uri "$base/auth/login" -Headers @{} -Body $loginBody -UseSession
$token = $login2.access_token
$headers = @{ Authorization = "Bearer $token" }

# Society
$stamp = [DateTimeOffset]::UtcNow.ToUnixTimeSeconds()
$soc = Invoke-Json -Name "POST /societies" -Method "POST" -Uri "$base/societies" -Headers $headers -Body @{ society_name = "Smoke-$stamp"; address = "Test Address" }
if (-not $soc) { $results | Format-Table -AutoSize | Out-String | Write-Output; exit 1 }
$societyId = $soc.society_id

Invoke-Json -Name "GET /societies" -Method "GET" -Uri "$base/societies" -Headers $headers | Out-Null
Invoke-Json -Name "GET /societies/{id}" -Method "GET" -Uri "$base/societies/$societyId" -Headers $headers | Out-Null
Invoke-Json -Name "PUT /societies/{id}" -Method "PUT" -Uri "$base/societies/$societyId" -Headers $headers -Body @{ address = "Updated Address" } | Out-Null

# User create/update/get
$userEmail = "rm.$stamp@blf.com"
$newUser = Invoke-Json -Name "POST /auth/users" -Method "POST" -Uri "$base/auth/users" -Headers $headers -Body @{ full_name = "RM $stamp"; email = $userEmail; password = "pass123"; role = "rm"; society_id = $societyId }
if ($newUser) {
    $uid = $newUser.user_id
    Invoke-Json -Name "GET /auth/user/{id}" -Method "GET" -Uri "$base/auth/user/$uid" -Headers $headers | Out-Null
    Invoke-Json -Name "PUT /auth/users/{id}" -Method "PUT" -Uri "$base/auth/users/$uid" -Headers $headers -Body @{ full_name = "RM Updated $stamp"; is_active = $true; society_id = $societyId } | Out-Null
}

# Plots
$plot = Invoke-Json -Name "POST /plots" -Method "POST" -Uri "$base/plots" -Headers $headers -Body @{ society_id = $societyId; plot_code = "P$stamp"; area_sqyd = 120; type = "R" }
$plot2 = Invoke-Json -Name "POST /plots (for delete)" -Method "POST" -Uri "$base/plots" -Headers $headers -Body @{ society_id = $societyId; plot_code = "PX$stamp"; area_sqyd = 80; type = "R" }
if ($plot) {
    $plotId = $plot.plot_id
    Invoke-Json -Name "GET /plots" -Method "GET" -Uri "$base/plots?society_id=$societyId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /plots/matrix" -Method "GET" -Uri "$base/plots/matrix?society_id=$societyId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /plots/{id}" -Method "GET" -Uri "$base/plots/$plotId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /plots/{id}/floors" -Method "GET" -Uri "$base/plots/$plotId/floors" -Headers $headers | Out-Null
    Invoke-Json -Name "PUT /plots/{id}" -Method "PUT" -Uri "$base/plots/$plotId" -Headers $headers -Body @{ area_sqyd = 125; type = "C" } | Out-Null
}
if ($plot2) {
    Invoke-Json -Name "DELETE /plots/{id}" -Method "DELETE" -Uri "$base/plots/$($plot2.plot_id)" -Headers $headers | Out-Null
}

# Floors
$floor = $null
$floorDeleteCandidate = $null
if ($plot) {
    $plotId = $plot.plot_id
    $floor = Invoke-Json -Name "POST /floors" -Method "POST" -Uri "$base/floors" -Headers $headers -Body @{ plot_id = $plotId; floor_no = 1 }
    $floorDeleteCandidate = Invoke-Json -Name "POST /floors (for delete)" -Method "POST" -Uri "$base/floors" -Headers $headers -Body @{ plot_id = $plotId; floor_no = 2 }
}
if ($floor) {
    $floorId = $floor.floor_id
    Invoke-Json -Name "GET /floors" -Method "GET" -Uri "$base/floors?society_id=$societyId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /floors/{id}" -Method "GET" -Uri "$base/floors/$floorId" -Headers $headers | Out-Null
    Invoke-Json -Name "PUT /floors/{id}/status" -Method "PUT" -Uri "$base/floors/$floorId/status" -Headers $headers -Body @{ status = "AVAILABLE" } | Out-Null
    Invoke-Json -Name "GET /floors/{id}/logs" -Method "GET" -Uri "$base/floors/$floorId/logs" -Headers $headers | Out-Null
}
if ($floorDeleteCandidate) {
    Invoke-Json -Name "DELETE /floors/{id}" -Method "DELETE" -Uri "$base/floors/$($floorDeleteCandidate.floor_id)" -Headers $headers | Out-Null
}

# Broker
$broker = $null
if ($newUser) {
    $broker = Invoke-Json -Name "POST /brokers" -Method "POST" -Uri "$base/brokers" -Headers $headers -Body @{ society_id = $societyId; broker_name = "Broker $stamp"; phone = "9$($stamp.ToString().Substring(0,9))"; user_id = $newUser.user_id }
}
if ($broker) {
    Invoke-Json -Name "GET /brokers" -Method "GET" -Uri "$base/brokers?society_id=$societyId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /brokers/{id}" -Method "GET" -Uri "$base/brokers/$($broker.broker_id)" -Headers $headers | Out-Null
    Invoke-Json -Name "PUT /brokers/{id}" -Method "PUT" -Uri "$base/brokers/$($broker.broker_id)" -Headers $headers -Body @{ broker_name = "Broker Updated $stamp" } | Out-Null
}

# Customer
$customer = Invoke-Json -Name "POST /customers" -Method "POST" -Uri "$base/customers" -Headers $headers -Body @{ society_id = $societyId; full_name = "Customer $stamp"; pan = "ABCDE$($stamp.ToString().Substring(0,5))F"; phone = "8$($stamp.ToString().Substring(0,9))"; email = "c.$stamp@x.com"; address = "Addr" }
if ($customer) {
    $cid = $customer.customer_id
    Invoke-Json -Name "GET /customers" -Method "GET" -Uri "$base/customers?society_id=$societyId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /customers/{id}" -Method "GET" -Uri "$base/customers/$cid" -Headers $headers | Out-Null
    Invoke-Json -Name "PUT /customers/{id}" -Method "PUT" -Uri "$base/customers/$cid" -Headers $headers -Body @{ address = "Updated Addr"; kyc_status = "DONE" } | Out-Null
    Invoke-Json -Name "PATCH /customers/{id}/pan" -Method "PATCH" -Uri "$base/customers/$cid/pan" -Headers $headers -Body @{ pan = "ZZZZZ$($stamp.ToString().Substring(0,5))Z" } | Out-Null
}

# Sale + payments + docs
$sale = $null
if ($floor -and $broker -and $customer) {
    $sale = Invoke-Json -Name "POST /sales" -Method "POST" -Uri "$base/sales" -Headers $headers -Body @{ floor_id = $floor.floor_id; broker_id = $broker.broker_id; customer_id = $customer.customer_id; total_value = 250000; commission_percent = 2.5 }
}
if ($sale) {
    $sid = $sale.sale_id
    Invoke-Json -Name "GET /sales" -Method "GET" -Uri "$base/sales?society_id=$societyId" -Headers $headers | Out-Null
    Invoke-Json -Name "GET /sales/{id}" -Method "GET" -Uri "$base/sales/$sid" -Headers $headers | Out-Null
    $payments = Invoke-Json -Name "GET /sales/{id}/payments" -Method "GET" -Uri "$base/sales/$sid/payments" -Headers $headers
    if ($payments -and $payments.Count -gt 0) {
        $pid = $payments[0].payment_id
        Invoke-Json -Name "PUT /payments/{id}" -Method "PUT" -Uri "$base/payments/$pid" -Headers $headers -Body @{ status = "DONE"; amount = 50000 } | Out-Null
    }
    Invoke-Json -Name "PUT /sales/{id}" -Method "PUT" -Uri "$base/sales/$sid" -Headers $headers -Body @{ commission_percent = 3.0 } | Out-Null

    $tmpFile = Join-Path $env:TEMP "smoke-$stamp.pdf"
    Set-Content -Path $tmpFile -Value "smoke document" -NoNewline

    $authHeader = "Authorization: Bearer $token"
    $uploadCmd = "curl.exe -s -X POST -H `"$authHeader`" -F `"label=SmokeDoc`" -F `"entity=SALE`" -F `"sale_id=$sid`" -F `"file=@$tmpFile;type=application/pdf`" $base/documents/upload"
    $uploadRaw = Invoke-Expression $uploadCmd
    try {
        $doc = $uploadRaw | ConvertFrom-Json
        if ($doc.document_id) {
            Add-Result "POST /documents/upload" $true "HTTP 2xx"
            $did = $doc.document_id
            Invoke-Json -Name "GET /documents/sale/{id}" -Method "GET" -Uri "$base/documents/sale/$sid" -Headers $headers | Out-Null
            Invoke-Json -Name "GET /documents/sale/{id}/{entity}" -Method "GET" -Uri "$base/documents/sale/$sid/SALE" -Headers $headers | Out-Null

            $downloadPath = Join-Path $env:TEMP "download-$stamp.pdf"
            $downloadCmd = "curl.exe -s -o `"$downloadPath`" -w `"%{http_code}`" -H `"$authHeader`" $base/documents/$did/download"
            $code = Invoke-Expression $downloadCmd
            if ($code -eq "200") { Add-Result "GET /documents/{id}/download" $true "HTTP 200" } else { Add-Result "GET /documents/{id}/download" $false "HTTP $code" }

            Invoke-Json -Name "DELETE /documents/{id}" -Method "DELETE" -Uri "$base/documents/$did" -Headers $headers | Out-Null
        } else {
            Add-Result "POST /documents/upload" $false "Unexpected response"
        }
    } catch {
        Add-Result "POST /documents/upload" $false "Upload parse/call failed"
    }

    Invoke-Json -Name "PUT /sales/{id}/status" -Method "PUT" -Uri "$base/sales/$sid/status" -Headers $headers -Body @{ status = "SOLD" } | Out-Null
}

# Optional deletes for entities that have dedicated delete routes
if ($broker) { Invoke-Json -Name "DELETE /brokers/{id}" -Method "DELETE" -Uri "$base/brokers/$($broker.broker_id)" -Headers $headers | Out-Null }
if ($customer) { Invoke-Json -Name "DELETE /customers/{id}" -Method "DELETE" -Uri "$base/customers/$($customer.customer_id)" -Headers $headers | Out-Null }
Invoke-Json -Name "GET /dashboard" -Method "GET" -Uri "$base/dashboard" -Headers $headers | Out-Null

$passCount = ($results | Where-Object { $_.Status -eq "PASS" }).Count
$failCount = ($results | Where-Object { $_.Status -eq "FAIL" }).Count

"=== Endpoint Smoke Test Summary ==="
"PASS: $passCount"
"FAIL: $failCount"
$results | Format-Table -AutoSize | Out-String | Write-Output
if ($failCount -gt 0) { exit 2 }
