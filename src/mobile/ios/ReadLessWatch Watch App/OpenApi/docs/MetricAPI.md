# MetricAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**recordMetric**](MetricAPI.md#recordmetric) | **POST** /v1/metric | 


# **recordMetric**
```swift
    open class func recordMetric(metricCreationAttributes: MetricCreationAttributes, completion: @escaping (_ data: MetricAttributes?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let metricCreationAttributes = MetricCreationAttributes(userAgent: "userAgent_example", referrer: ["referrer_example"], data: 123, type: "type_example") // MetricCreationAttributes | 

MetricAPI.recordMetric(metricCreationAttributes: metricCreationAttributes) { (response, error) in
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
 **metricCreationAttributes** | [**MetricCreationAttributes**](MetricCreationAttributes.md) |  | 

### Return type

[**MetricAttributes**](MetricAttributes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

