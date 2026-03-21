# DeviceShield API

Base URL: `/api`

## Devices

### Register device
`POST /devices/register`

Body:
```json
{
  "name": "iPhone 11",
  "nickname": "My Phone",
  "imei": "356868012345678",
  "ownerEmail": "owner@email.com"
}
```

### Verify device
`GET /devices/:imei`

Response:
```json
{
  "success": true,
  "data": {
    "imei": "356868012345678",
    "status": "active",
    "label": "Safe"
  }
}
```

### List devices by owner
`GET /devices?ownerEmail=owner@email.com`

### Report stolen
`PUT /devices/report-stolen/:id`

## Transfers

### Initiate transfer
`POST /transfers/initiate`

Body:
```json
{
  "deviceId": "<device-id>",
  "sellerEmail": "seller@email.com",
  "buyerEmail": "buyer@email.com"
}
```

### List pending transfers for buyer
`GET /transfers?buyerEmail=buyer@email.com`

### Accept transfer
`PUT /transfers/accept/:id`

### Reject transfer
`PUT /transfers/reject/:id`
