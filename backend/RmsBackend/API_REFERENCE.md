# OpenAPI definition
## Version: v0

### /api/vendor/v1/update-vendor/{vendorId}

#### PUT
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| vendorId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/update-child-dish

#### PUT
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/vendor/v1/add-vendor

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/user/v1/register

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/user/v1/login

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/table/v1/add

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/payment/v1/process-payment

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/payment/v1/pay-due

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/order-details

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/increase/{orderId}/{dishId}

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| dishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/decrease/{tableId}/{dishId}

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |
| dishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/create-order

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/add-items/{tableId}

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/add-dish/{tableId}/{dishId}

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |
| dishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/inventory-item/v1/get-all

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/inventory-item/v1/add

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/add-parent-dish/{dishName}

#### POST
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| dishName | path |  | Yes | string |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/add-child-dish

#### POST
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/user/v1/update

#### PATCH
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/user/v1/change-role/{userId}

#### PATCH
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/table/v1/update/{tableId}

#### PATCH
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/inventory-item/v1/update/{itemId}

#### PATCH
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| itemId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/update-parent-dish/{parentDishId}

#### PATCH
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| parentDishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/vendor/v1/get-vendor/{vendorId}

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| vendorId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/vendor/v1/get-all-vendors

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/user/v1/get-all-users

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/table/v1/get/{tableId}

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/table/v1/get-all

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/payment/v1/pending-dues

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/pending-orders

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/pending-order/{tableId}

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/get-dish/{childDishId}

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| childDishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/get-childs/{parentDishId}

#### GET
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| parentDishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/get-all-parents

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/get-all-childs

#### GET
##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/vendor/v1/delete-vendor/{vendorId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| vendorId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/user/v1/delete-user/{userId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| userId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/table/v1/delete/{tableId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/remove-dish/{tableId}/{dishId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |
| dishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/order/v1/delete-pending-order/{tableId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| tableId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/inventory-item/v1/delete/{itemId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| itemId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/remove-parent-dish/{parentDishId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| parentDishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### /api/dish/v1/remove-child-dish/{childDishId}

#### DELETE
##### Parameters

| Name | Located in | Description | Required | Schema |
| ---- | ---------- | ----------- | -------- | ---- |
| childDishId | path |  | Yes | integer |

##### Responses

| Code | Description |
| ---- | ----------- |
| 200 | OK |

### Models


#### VendorRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| vendorName | string |  | Yes |

#### ApiResponseObject

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| pagination |  |  | No |
| message | string |  | No |
| count | long |  | No |
| success | boolean |  | No |
| data |  |  | No |

#### UpdateDishRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| dishId | integer |  | No |
| dishName | string |  | No |
| description | string |  | No |
| price | number |  | No |
| imageUrl | string |  | No |
| tags | string |  | No |

#### RegisterRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fullName | string |  | Yes |
| mobileNo | string |  | No |
| email | string |  | Yes |
| password | string |  | Yes |

#### LoginRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| email | string |  | Yes |
| password | string |  | Yes |

#### AddTableRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tableName | string |  | Yes |
| seatCapacity | integer |  | Yes |

#### AddPaymentRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tableId | integer |  | Yes |
| discount | number |  | Yes |
| payments | [ [PaymentMethodRequest](#paymentmethodrequest) ] |  | Yes |
| dueDetails | [DueDetailsRequest](#duedetailsrequest) |  | No |

#### DueDetailsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| customerName | string |  | Yes |
| mobileNumber | string |  | No |

#### PaymentMethodRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| paymentMethod | string |  | Yes |
| amount | number |  | Yes |
| transactionId | string |  | No |

#### PayDueRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| customerName | string |  | No |
| mobileNumber | string |  | No |
| paymentMethod | string |  | No |
| paymentAmount | number |  | No |
| transactionId | string |  | No |

#### OrderDetailsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| startDate | date |  | No |
| endDate | date |  | No |
| validDateRange | boolean |  | No |

#### CreateOrderRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tableId | integer |  | Yes |
| orderItems | [ [OrderItemRequest](#orderitemrequest) ] |  | Yes |
| instruction | string |  | No |

#### OrderItemRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| dishId | integer |  | Yes |
| quantity | integer |  | Yes |

#### AddOrderItemsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| orderItems | [ [OrderItemRequest](#orderitemrequest) ] |  | Yes |

#### GetInventoryItemsRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| startDate | date |  | Yes |
| endDate | date |  | Yes |

#### AddInventoryItemRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| itemName | string |  | Yes |
| price | number |  | Yes |
| paymentMethod | string |  | Yes |
| vendorId | integer |  | Yes |

#### AddChildDishRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| dishName | string |  | Yes |
| description | string |  | No |
| price | number |  | Yes |
| imageUrl | string |  | No |
| parentDishId | integer |  | Yes |
| tags | string |  | No |

#### UpdateUserRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| fullName | string |  | No |
| email | string |  | No |
| mobileNo | string |  | No |
| password | string |  | No |

#### UpdateUserRoleRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| role | string |  | Yes |

#### UpdateTableRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| tableName | string |  | No |
| seatCapacity | integer |  | No |

#### UpdateInventoryItemRequest

| Name | Type | Description | Required |
| ---- | ---- | ----------- | -------- |
| itemName | string |  | No |
| price | number |  | No |
| paymentMethod | string |  | No |
| vendorId | integer |  | No |