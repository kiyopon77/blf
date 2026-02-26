## Instructions to run db

Run db using

```
docker compose up -d
```


It will create the database, volume, and run it live on ```localhost:5050```

---

Make a ```.env``` file with the following vars

```
POSTGRES_DB=realestate
POSTGRES_USER=admin
POSTGRES_PASSWORD=admin123
```

Now at the pgAdmin page login using ```admin@admin.com``` & ```admin123```

---

Inside the pgAdmin page create a new server:
```
name: any
connection:
    hostname/address: db
    password: admin123
```
