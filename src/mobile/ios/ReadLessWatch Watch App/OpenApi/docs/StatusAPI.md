# StatusAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getStatus**](StatusAPI.md#getstatus) | **GET** /v1/status/{name} | 
[**getStatuses**](StatusAPI.md#getstatuses) | **GET** /v1/status | 


# **getStatus**
```swift
    open class func getStatus(name: String, userId: Double? = nil, filter: String? = nil, completion: @escaping (_ data: StatusAttributes?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let name = "name_example" // String | 
let userId = 987 // Double |  (optional)
let filter = "filter_example" // String |  (optional)

StatusAPI.getStatus(name: name, userId: userId, filter: filter) { (response, error) in
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
 **name** | **String** |  | 
 **userId** | **Double** |  | [optional] 
 **filter** | **String** |  | [optional] 

### Return type

[**StatusAttributes**](StatusAttributes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **getStatuses**
```swift
    open class func getStatuses(userId: Double? = nil, filter: String? = nil, completion: @escaping (_ data: BulkResponseStatusAttributes?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let userId = 987 // Double |  (optional)
let filter = "filter_example" // String |  (optional)

StatusAPI.getStatuses(userId: userId, filter: filter) { (response, error) in
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

### Return type

[**BulkResponseStatusAttributes**](BulkResponseStatusAttributes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

