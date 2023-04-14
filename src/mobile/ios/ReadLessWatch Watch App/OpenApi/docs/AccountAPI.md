# AccountAPI

All URIs are relative to *http://localhost*

Method | HTTP request | Description
------------- | ------------- | -------------
[**generateOTP**](AccountAPI.md#generateotp) | **POST** /v1/account/otp | 
[**login**](AccountAPI.md#login) | **POST** /v1/account/login | 
[**logout**](AccountAPI.md#logout) | **POST** /v1/account/logout | 
[**register**](AccountAPI.md#register) | **POST** /v1/account/register | 
[**updateCredential**](AccountAPI.md#updatecredential) | **PUT** /v1/account/update/credential | 
[**verifyAlias**](AccountAPI.md#verifyalias) | **POST** /v1/account/verify/alias | 
[**verifyOTP**](AccountAPI.md#verifyotp) | **POST** /v1/account/verify/otp | 


# **generateOTP**
```swift
    open class func generateOTP(partialGenerateOTPRequest: PartialGenerateOTPRequest, completion: @escaping (_ data: GenerateOTPResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialGenerateOTPRequest = Partial_GenerateOTPRequest_(email: "email_example", eth2Address: "eth2Address_example", phone: "phone_example", thirdParty: ThirdPartyAuth(credential: "credential_example", userId: ThirdPartyAuth_userId(), name: ThirdParty()), userId: 123, username: "username_example", thirdPartyGoogle: "thirdPartyGoogle_example") // PartialGenerateOTPRequest | 

AccountAPI.generateOTP(partialGenerateOTPRequest: partialGenerateOTPRequest) { (response, error) in
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
 **partialGenerateOTPRequest** | [**PartialGenerateOTPRequest**](PartialGenerateOTPRequest.md) |  | 

### Return type

[**GenerateOTPResponse**](GenerateOTPResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **login**
```swift
    open class func login(partialLoginRequest: PartialLoginRequest, completion: @escaping (_ data: LoginResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialLoginRequest = Partial_LoginRequest_(email: "email_example", eth2Address: "eth2Address_example", otp: "otp_example", phone: "phone_example", thirdParty: ThirdPartyAuth(credential: "credential_example", userId: ThirdPartyAuth_userId(), name: ThirdParty()), userId: 123, username: "username_example", thirdPartyGoogle: "thirdPartyGoogle_example", eth2SignedMessage: "eth2SignedMessage_example", password: "password_example", requestedRole: "requestedRole_example", requestedScope: ["requestedScope_example"]) // PartialLoginRequest | 

AccountAPI.login(partialLoginRequest: partialLoginRequest) { (response, error) in
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
 **partialLoginRequest** | [**PartialLoginRequest**](PartialLoginRequest.md) |  | 

### Return type

[**LoginResponse**](LoginResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **logout**
```swift
    open class func logout(partialLogoutRequest: PartialLogoutRequest, completion: @escaping (_ data: LogoutResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialLogoutRequest = Partial_LogoutRequest_(userId: 123, token: "token_example", force: false) // PartialLogoutRequest | 

AccountAPI.logout(partialLogoutRequest: partialLogoutRequest) { (response, error) in
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
 **partialLogoutRequest** | [**PartialLogoutRequest**](PartialLogoutRequest.md) |  | 

### Return type

[**LogoutResponse**](LogoutResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **register**
```swift
    open class func register(partialRegistrationRequest: PartialRegistrationRequest, completion: @escaping (_ data: RegistrationResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialRegistrationRequest = Partial_RegistrationRequest_(email: "email_example", eth2Address: "eth2Address_example", otp: "otp_example", phone: "phone_example", thirdParty: ThirdPartyAuth(credential: "credential_example", userId: ThirdPartyAuth_userId(), name: ThirdParty()), userId: 123, username: "username_example", thirdPartyGoogle: "thirdPartyGoogle_example", eth2SignedMessage: "eth2SignedMessage_example", password: "password_example") // PartialRegistrationRequest | 

AccountAPI.register(partialRegistrationRequest: partialRegistrationRequest) { (response, error) in
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
 **partialRegistrationRequest** | [**PartialRegistrationRequest**](PartialRegistrationRequest.md) |  | 

### Return type

[**RegistrationResponse**](RegistrationResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **updateCredential**
```swift
    open class func updateCredential(partialUpdateCredentialRequest: PartialUpdateCredentialRequest, completion: @escaping (_ data: UpdateCredentialResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialUpdateCredentialRequest = Partial_UpdateCredentialRequest_(userId: 123, password: "password_example") // PartialUpdateCredentialRequest | 

AccountAPI.updateCredential(partialUpdateCredentialRequest: partialUpdateCredentialRequest) { (response, error) in
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
 **partialUpdateCredentialRequest** | [**PartialUpdateCredentialRequest**](PartialUpdateCredentialRequest.md) |  | 

### Return type

[**UpdateCredentialResponse**](UpdateCredentialResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyAlias**
```swift
    open class func verifyAlias(partialVerifyAliasRequest: PartialVerifyAliasRequest, completion: @escaping (_ data: VerifyAliasResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialVerifyAliasRequest = Partial_VerifyAliasRequest_(verificationCode: "verificationCode_example") // PartialVerifyAliasRequest | 

AccountAPI.verifyAlias(partialVerifyAliasRequest: partialVerifyAliasRequest) { (response, error) in
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
 **partialVerifyAliasRequest** | [**PartialVerifyAliasRequest**](PartialVerifyAliasRequest.md) |  | 

### Return type

[**VerifyAliasResponse**](VerifyAliasResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

# **verifyOTP**
```swift
    open class func verifyOTP(partialVerifyOTPRequest: PartialVerifyOTPRequest, completion: @escaping (_ data: VerifyOTPResponse?, _ error: Error?) -> Void)
```



### Example
```swift
// The following code samples are still beta. For any issue, please report via http://github.com/OpenAPITools/openapi-generator/issues/new
import OpenAPIClient

let partialVerifyOTPRequest = Partial_VerifyOTPRequest_(email: "email_example", eth2Address: "eth2Address_example", otp: "otp_example", phone: "phone_example", thirdParty: ThirdPartyAuth(credential: "credential_example", userId: ThirdPartyAuth_userId(), name: ThirdParty()), userId: 123, username: "username_example", thirdPartyGoogle: "thirdPartyGoogle_example") // PartialVerifyOTPRequest | 

AccountAPI.verifyOTP(partialVerifyOTPRequest: partialVerifyOTPRequest) { (response, error) in
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
 **partialVerifyOTPRequest** | [**PartialVerifyOTPRequest**](PartialVerifyOTPRequest.md) |  | 

### Return type

[**VerifyOTPResponse**](VerifyOTPResponse.md)

### Authorization

No authorization required

### HTTP request headers

 - **Content-Type**: application/json
 - **Accept**: application/json

[[Back to top]](#) [[Back to API list]](../README.md#documentation-for-api-endpoints) [[Back to Model list]](../README.md#documentation-for-models) [[Back to README]](../README.md)

