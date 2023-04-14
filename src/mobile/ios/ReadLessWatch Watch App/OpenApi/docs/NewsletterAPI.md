# NewsletterAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**subscribeToNewsletter**](NewsletterAPI.md#subscribetonewsletter) | **POST** /v1/newsletter/subscribe | 
[**unsubscribeFromNewsletter**](NewsletterAPI.md#unsubscribefromnewsletter) | **POST** /v1/newsletter/unsubscribe | 


# **subscribeToNewsletter**
```swift
    open class func subscribeToNewsletter(subscriptionCreationAttributes: SubscriptionCreationAttributes, completion: @escaping (_ data: SubscriptionAttributes?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let subscriptionCreationAttributes = SubscriptionCreationAttributes(newsletterName: "newsletterName_example", newsletterId: 123, alias: "alias_example", aliasType: "aliasType_example") // SubscriptionCreationAttributes | 

NewsletterAPI.subscribeToNewsletter(subscriptionCreationAttributes: subscriptionCreationAttributes) { (response, error) in
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
 **subscriptionCreationAttributes** | [**SubscriptionCreationAttributes**](SubscriptionCreationAttributes.md) |  | 

### Return type

[**SubscriptionAttributes**](SubscriptionAttributes.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **unsubscribeFromNewsletter**
```swift
    open class func unsubscribeFromNewsletter(subscriptionCreationAttributes: SubscriptionCreationAttributes, completion: @escaping (_ data: Void?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let subscriptionCreationAttributes = SubscriptionCreationAttributes(newsletterName: "newsletterName_example", newsletterId: 123, alias: "alias_example", aliasType: "aliasType_example") // SubscriptionCreationAttributes | 

NewsletterAPI.unsubscribeFromNewsletter(subscriptionCreationAttributes: subscriptionCreationAttributes) { (response, error) in
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
 **subscriptionCreationAttributes** | [**SubscriptionCreationAttributes**](SubscriptionCreationAttributes.md) |  | 

### Return type

Void (empty response body)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: Not defined

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

