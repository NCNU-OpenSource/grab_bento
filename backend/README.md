# grab_bento_backend
## Tables
- Event
    - `event_id`, Integer
    - `event_name`, String
    - `event_time`, DateTime
    - `event_place`, String
    - `event_duration`, Integer
    - `end_reservation_date`, DateTime
    - `info_url`, String
    - `tags`, String

- User
    - `user_id`, Integer
    - `user_name`, String
    - `events`, String
    - `user_pw`, String

## Api
- event CRD
- user CRUD
- user_events(method = GET)
- reserve(method = POST)
- cancel(method = POST)

## API example
### create User
```
{
    "user_name": "chofinn",
    "user_pw": "chi11",
}
```
### create Event
```
{
    "event_name": "吃便當",
    "event_time": "2021/6/30 15:00:00",
    "event_place": "2021/6/30 15:00:00",
    "event_duration": "48",
    "end_reservation_date": "2021/6/29 15:00:00",
    "info_url": "http://erdos.csie.ncnu.edu.tw/~klim/",
}
```
### reserve
```
{
    "event_id": "3009"
}
```
### >>>重要<<< key 的產生方式
- `$ python`
- `>>> from cryptography.fernet import Fernet`
- `>>> key = Fernet.generate_key()`
- `>>> key`
- 如此將會印出產生的一組 key，回到 shell
- `$ cat > pw_key.key`
- 複製剛剛產生的 key，複製過來，再按 ctrl+D
