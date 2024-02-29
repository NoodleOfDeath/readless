//
// StatusAPI.swift
//
// Generated by openapi-generator
// https://openapi-generator.tech
//

import Foundation
#if canImport(AnyCodable)
import AnyCodable
#endif

open class StatusAPI {

    /**

     - parameter name: (path)  
     - parameter userId: (query)  (optional)
     - parameter filter: (query)  (optional)
     - parameter apiResponseQueue: The queue on which api response is dispatched.
     - parameter completion: completion handler to receive the data and the error objects
     */
    @discardableResult
    open class func getStatus(name: String, userId: Double? = nil, filter: String? = nil, apiResponseQueue: DispatchQueue = OpenAPIClientAPI.apiResponseQueue, completion: @escaping ((_ data: StatusAttributes?, _ error: Error?) -> Void)) -> RequestTask {
        return getStatusWithRequestBuilder(name: name, userId: userId, filter: filter).execute(apiResponseQueue) { result in
            switch result {
            case let .success(response):
                completion(response.body, nil)
            case let .failure(error):
                completion(nil, error)
            }
        }
    }

    /**
     - GET /v1/status/{name}
     - parameter name: (path)  
     - parameter userId: (query)  (optional)
     - parameter filter: (query)  (optional)
     - returns: RequestBuilder<StatusAttributes> 
     */
    open class func getStatusWithRequestBuilder(name: String, userId: Double? = nil, filter: String? = nil) -> RequestBuilder<StatusAttributes> {
        var localVariablePath = "/v1/status/{name}"
        let namePreEscape = "\(APIHelper.mapValueToPathItem(name))"
        let namePostEscape = namePreEscape.addingPercentEncoding(withAllowedCharacters: .urlPathAllowed) ?? ""
        localVariablePath = localVariablePath.replacingOccurrences(of: "{name}", with: namePostEscape, options: .literal, range: nil)
        let localVariableURLString = OpenAPIClientAPI.basePath + localVariablePath
        let localVariableParameters: [String: Any]? = nil

        var localVariableUrlComponents = URLComponents(string: localVariableURLString)
        localVariableUrlComponents?.queryItems = APIHelper.mapValuesToQueryItems([
            "userId": (wrappedValue: userId?.encodeToJSON(), isExplode: true),
            "filter": (wrappedValue: filter?.encodeToJSON(), isExplode: true),
        ])

        let localVariableNillableHeaders: [String: Any?] = [
            :
        ]

        let localVariableHeaderParameters = APIHelper.rejectNilHeaders(localVariableNillableHeaders)

        let localVariableRequestBuilder: RequestBuilder<StatusAttributes>.Type = OpenAPIClientAPI.requestBuilderFactory.getBuilder()

        return localVariableRequestBuilder.init(method: "GET", URLString: (localVariableUrlComponents?.string ?? localVariableURLString), parameters: localVariableParameters, headers: localVariableHeaderParameters, requiresAuthentication: false)
    }

    /**

     - parameter userId: (query)  (optional)
     - parameter filter: (query)  (optional)
     - parameter apiResponseQueue: The queue on which api response is dispatched.
     - parameter completion: completion handler to receive the data and the error objects
     */
    @discardableResult
    open class func getStatuses(userId: Double? = nil, filter: String? = nil, apiResponseQueue: DispatchQueue = OpenAPIClientAPI.apiResponseQueue, completion: @escaping ((_ data: BulkResponseStatusAttributes?, _ error: Error?) -> Void)) -> RequestTask {
        return getStatusesWithRequestBuilder(userId: userId, filter: filter).execute(apiResponseQueue) { result in
            switch result {
            case let .success(response):
                completion(response.body, nil)
            case let .failure(error):
                completion(nil, error)
            }
        }
    }

    /**
     - GET /v1/status
     - parameter userId: (query)  (optional)
     - parameter filter: (query)  (optional)
     - returns: RequestBuilder<BulkResponseStatusAttributes> 
     */
    open class func getStatusesWithRequestBuilder(userId: Double? = nil, filter: String? = nil) -> RequestBuilder<BulkResponseStatusAttributes> {
        let localVariablePath = "/v1/status"
        let localVariableURLString = OpenAPIClientAPI.basePath + localVariablePath
        let localVariableParameters: [String: Any]? = nil

        var localVariableUrlComponents = URLComponents(string: localVariableURLString)
        localVariableUrlComponents?.queryItems = APIHelper.mapValuesToQueryItems([
            "userId": (wrappedValue: userId?.encodeToJSON(), isExplode: true),
            "filter": (wrappedValue: filter?.encodeToJSON(), isExplode: true),
        ])

        let localVariableNillableHeaders: [String: Any?] = [
            :
        ]

        let localVariableHeaderParameters = APIHelper.rejectNilHeaders(localVariableNillableHeaders)

        let localVariableRequestBuilder: RequestBuilder<BulkResponseStatusAttributes>.Type = OpenAPIClientAPI.requestBuilderFactory.getBuilder()

        return localVariableRequestBuilder.init(method: "GET", URLString: (localVariableUrlComponents?.string ?? localVariableURLString), parameters: localVariableParameters, headers: localVariableHeaderParameters, requiresAuthentication: false)
    }
}
