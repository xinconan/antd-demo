# antd-demo
antd demo

## usage
dev:
```bash
yarn start
# or
npm start
```

server:
```bash
npm run server
```

## sql
- 查询摇号次数>5的人
```sql
select buyers_name, buyers_idnumber,count(*) time from register group by buyers_name, buyers_idnumber having count(*)>5;
```

