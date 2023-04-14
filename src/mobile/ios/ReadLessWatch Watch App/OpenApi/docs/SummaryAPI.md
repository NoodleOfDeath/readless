# SummaryAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**destroySummary**](SummaryAPI.md#destroysummary) | **DELETE** /v1/summary/{targetId} | 
[**getSummaries**](SummaryAPI.md#getsummaries) | **GET** /v1/summary | 
[**interactWithSummary**](SummaryAPI.md#interactwithsummary) | **POST** /v1/summary/interact/{targetId}/{type} | 
[**restoreSummary**](SummaryAPI.md#restoresummary) | **PATCH** /v1/summary/restore/{targetId} | 


# **destroySummary**
```swift
    open class func destroySummary(targetId: Double, payloadWithUserId: PayloadWithUserId, completion: @escaping (_ data: DestroyResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let targetId = 987 // Double | 
let payloadWithUserId = PayloadWithUserId(userId: 123) // PayloadWithUserId | 

SummaryAPI.destroySummary(targetId: targetId, payloadWithUserId: payloadWithUserId) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **targetId** | **Double** |  | 
 **payloadWithUserId** | [**PayloadWithUserId**](PayloadWithUserId.md) |  | 

### Return type

[**DestroyResponse**](DestroyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getSummaries**
```swift
    open class func getSummaries(userId: Double? = nil, filter: String? = nil, ids: [Double]? = nil, pageSize: Double? = nil, page: Double? = nil, offset: Double? = nil, completion: @escaping (_ data: BulkResponsePublicSummaryAttributes?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let userId = 987 // Double |  (optional)
let filter = "filter_example" // String |  (optional)
let ids = [123] // [Double] |  (optional)
let pageSize = 987 // Double |  (optional) (default to 10)
let page = 987 // Double |  (optional) (default to 0)
let offset = 987 // Double |  (optional)

SummaryAPI.getSummaries(userId: userId, filter: filter, ids: ids, pageSize: pageSize, page: page, offset: offset) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **userId** | **Double** |  | [optional] 
 **filter** | **String** |  | [optional] 
 **ids** | [**[Double]**](Double.md) |  | [optional] 
 **pageSize** | **Double** |  | [optional] [default to 10]
 **page** | **Double** |  | [optional] [default to 0]
 **offset** | **Double** |  | [optional] 

### Return type

[**BulkResponsePublicSummaryAttributes**](BulkResponsePublicSummaryAttributes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **interactWithSummary**
```swift
    open class func interactWithSummary(targetId: Double, type: InteractionType, interactionRequest: InteractionRequest, completion: @escaping (_ data: InteractionResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let targetId = 987 // Double | 
let type = InteractionType() // InteractionType | 
let interactionRequest = InteractionRequest(metadata: 123, content: "content_example", remoteAddr: "remoteAddr_example", userId: 123) // InteractionRequest | 

SummaryAPI.interactWithSummary(targetId: targetId, type: type, interactionRequest: interactionRequest) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **targetId** | **Double** |  | 
 **type** | [**InteractionType**](.md) |  | 
 **interactionRequest** | [**InteractionRequest**](InteractionRequest.md) |  | 

### Return type

[**InteractionResponse**](InteractionResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **restoreSummary**
```swift
    open class func restoreSummary(targetId: Double, payloadWithUserId: PayloadWithUserId, completion: @escaping (_ data: DestroyResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let targetId = 987 // Double | 
let payloadWithUserId = PayloadWithUserId(userId: 123) // PayloadWithUserId | 

SummaryAPI.restoreSummary(targetId: targetId, payloadWithUserId: payloadWithUserId) { (response, error) in
    guard error == nil else {
        print(error)
        return
    }

    if (response) {
        dump(response)
    }
}
```

### Parameters

Name | Type | Description  | Notes
------------- | ------------- | ------------- | -------------
 **targetId** | **Double** |  | 
 **payloadWithUserId** | [**PayloadWithUserId**](PayloadWithUserId.md) |  | 

### Return type

[**DestroyResponse**](DestroyResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

