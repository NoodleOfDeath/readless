package ai.readless.ReadLess

import android.net.Uri
import android.os.Build
import androidx.annotation.RequiresApi
import org.json.JSONObject
import java.time.LocalDateTime
import java.time.format.DateTimeFormatter
import java.time.temporal.ChronoUnit
import kotlin.math.abs

@RequiresApi(Build.VERSION_CODES.O)
fun parseDate(string: String): LocalDateTime {
    try {
        return LocalDateTime.parse(string, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ss.SSSZZZZZ"))
    } catch (e: Exception) {
        return LocalDateTime.parse(string, DateTimeFormatter.ofPattern("yyyy-MM-dd'T'HH:mm:ssZZZZZ"))
    }
}

@RequiresApi(Build.VERSION_CODES.O)
fun formatDate(dateTime: LocalDateTime, format: String = "MM/dd h:mm a"): String {
    return dateTime.format(DateTimeFormatter.ofPattern(format))
}

@RequiresApi(Build.VERSION_CODES.O)
fun distanceFromNow(dateTime: LocalDateTime): String {
    val now = LocalDateTime.now()
    val minutes = abs(ChronoUnit.MINUTES.between(now, dateTime))
    val hours = abs(ChronoUnit.HOURS.between(now, dateTime))
    val days = abs(ChronoUnit.DAYS.between(now, dateTime))
    if (days > 0) {
        return "${days}d"
    } else if (hours > 0) {
        return "${hours}h"
    }
    return "${minutes}m"
}

class Publisher {
    private var id: Long
    var name: String
    var displayName: String

    val icon get(): String = "https://readless.nyc3.cdn.digitaloceanspaces.com/img/pub/$name.png"

    constructor(obj: JSONObject) {
        this.id = obj.getInt("id").toLong()
        this.name = obj.getString("name")
        this.displayName = obj.getString("displayName")
    }
}

class Category {
    var id: Long
    var name: String
    var displayName: String
    var icon: String

    constructor(obj: JSONObject) {
        this.id = obj.getInt("id").toLong()
        this.name = obj.getString("name")
        this.displayName = obj.getString("displayName")
        this.icon = obj.getString("icon")
    }

}

enum class MediaType {
    Image, PublisherIcon
}

enum class MediaResolution {
    XS, SM, MD, LG, XL, XXL
}

class Summary {
    var id: Long
    var url: String
    var title: String
    var shortSummary: String
    var publisher: Publisher
    private var category: Category
    private var imageUrl: String?
    private var media: JSONObject?
    var originalDate: LocalDateTime
    private var translations: JSONObject?

    val deeplink get(): String = "https://readless.ai/read/?s=$id"

    fun getMediaUrl(type: MediaType, resolution: MediaResolution? = null): Uri? {
        if (type == MediaType.Image) {
            if (media == null) {
                return if (imageUrl != null) Uri.parse(imageUrl) else null
            }
            val img = try { media?.getString("imageArticle@${resolution?.name?.lowercase() ?: ""}") }
            catch(e: Exception) {
                try { media?.getString("imageAi1@${resolution?.name?.lowercase() ?: ""}") }
                catch (e: Exception) {
                    try { media?.getString("imageArticle") }
                    catch (e: Exception) {
                        try { media?.getString("imageAi1") }
                        catch(e: Exception) { null }
                    }
                }
            } ?: return null
            return Uri.parse(img)
        } else if( type == MediaType.PublisherIcon) {
            return Uri.parse(publisher.icon)
        }
        return null
    }

    @RequiresApi(Build.VERSION_CODES.O)
    constructor(obj: JSONObject) {
        this.id = obj.getInt("id").toLong()
        this.url = obj.getString("url")
        this.title = obj.getString("title")
        this.shortSummary = obj.getString("shortSummary")
        this.publisher = Publisher(obj.getJSONObject("publisher"))
        this.category = Category(obj.getJSONObject("category"))
        this.imageUrl = obj.getString("imageUrl")
        this.media = try { obj.getJSONObject("media") } catch (e: Exception) { null }
        this.originalDate = parseDate(obj.getString("originalDate"))
        this.translations = try { obj.getJSONObject("translations") } catch (e: Exception) { null }
    }
}
