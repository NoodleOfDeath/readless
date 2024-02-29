# ReleaseAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**getReleases**](ReleaseAPI.md#getreleases) | **GET** /v1/version/releases | 


# **getReleases**
```swift
    open class func getReleases(userId: Double? = nil, filter: String? = nil, completion: @escaping (_ data: BulkResponseReleaseAttributes?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let userId = 987 // Double |  (optional)
let filter = "filter_example" // String |  (optional)

ReleaseAPI.getReleases(userId: userId, filter: filter) { (response, error) in
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

[**BulkResponseReleaseAttributes**](BulkResponseReleaseAttributes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: Not defined
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

