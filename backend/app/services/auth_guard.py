from collections import deque
from dataclasses import dataclass
from threading import Lock
from time import time


@dataclass
class AttemptState:
    attempts: deque
    locked_until: float = 0.0


class InMemoryAuthGuard:
    def __init__(self) -> None:
        self._store: dict[str, AttemptState] = {}
        self._lock = Lock()

    def _prune(self, state: AttemptState, window_seconds: int, now_ts: float) -> None:
        while state.attempts and now_ts - state.attempts[0] > window_seconds:
            state.attempts.popleft()

    def check_allowed(self, key: str, window_seconds: int, max_attempts: int, lockout_seconds: int) -> tuple[bool, int]:
        now_ts = time()
        with self._lock:
            state = self._store.get(key)
            if not state:
                return True, 0

            if state.locked_until > now_ts:
                return False, max(1, int(state.locked_until - now_ts))

            self._prune(state, window_seconds, now_ts)
            if len(state.attempts) >= max_attempts:
                state.locked_until = now_ts + lockout_seconds
                state.attempts.clear()
                return False, lockout_seconds

            return True, 0

    def register_failure(self, key: str, window_seconds: int, max_attempts: int, lockout_seconds: int) -> tuple[bool, int]:
        now_ts = time()
        with self._lock:
            state = self._store.get(key)
            if not state:
                state = AttemptState(attempts=deque())
                self._store[key] = state

            if state.locked_until > now_ts:
                return False, max(1, int(state.locked_until - now_ts))

            self._prune(state, window_seconds, now_ts)
            state.attempts.append(now_ts)

            if len(state.attempts) >= max_attempts:
                state.locked_until = now_ts + lockout_seconds
                state.attempts.clear()
                return False, lockout_seconds

            return True, 0

    def reset(self, key: str) -> None:
        with self._lock:
            self._store.pop(key, None)


auth_guard = InMemoryAuthGuard()
