package ai.readless.ReadLess

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.RemoteViews
import android.widget.RemoteViews.RemoteCollectionItems
import android.widget.RemoteViews.RemoteResponse
import androidx.annotation.RequiresApi
import org.json.JSONObject
import java.lang.Exception
import java.net.URL
import kotlin.concurrent.thread

const val ROOT_ENDPOINT = "https://api.readless.ai/v1"
val ENDPOINTS = mapOf<Channel, String>(
        Channel.TopStories to "$ROOT_ENDPOINT/summary/top",
        Channel.LiveFeed to "$ROOT_ENDPOINT/summary",
        Channel.CustomTopic to "$ROOT_ENDPOINT/summary?filter=",
)

fun buildEndpoint(channel: Channel, filter: String = ""): String {
    val base = ENDPOINTS[channel]
    return if (channel == Channel.CustomTopic) "$base$filter" else "$base"
}

/**
 * Implementation of App Widget functionality.
 * App Widget Configuration implemented in [ReadLessAppWidgetConfigureActivity]
 */
@RequiresApi(Build.VERSION_CODES.S)
class ReadLessAppWidget : AppWidgetProvider() {

    override fun onUpdate(context: Context, appWidgetManager: AppWidgetManager, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            updateAppWidget(context, appWidgetManager, appWidgetId)
        }
    }

    override fun onAppWidgetOptionsChanged(context: Context?, appWidgetManager: AppWidgetManager?, appWidgetId: Int, newOptions: Bundle?) {
        if (context == null || appWidgetManager == null) {
            return
        }
        updateAppWidget(context, appWidgetManager, appWidgetId)
    }

    override fun onDeleted(context: Context, appWidgetIds: IntArray) {
        for (appWidgetId in appWidgetIds) {
            for (key in PrefKey.values()) {
                deletePref(context, appWidgetId, key)
            }
        }
    }
    override fun onEnabled(context: Context) {
        super.onEnabled(context)
    }

    override fun onDisabled(context: Context) {
        super.onDisabled(context)
    }

    override fun onRestored(context: Context?, oldWidgetIds: IntArray?, newWidgetIds: IntArray?) {
        super.onRestored(context, oldWidgetIds, newWidgetIds)
    }
}

@RequiresApi(Build.VERSION_CODES.S)
internal fun updateAppWidget(context: Context, appWidgetManager: AppWidgetManager, appWidgetId: Int) {

    // Load preferences
    val channelStr = loadPref(context, appWidgetId, PrefKey.Channel)
    val widgetChannel = if (channelStr != null) Channel.valueOf(channelStr) else Channel.TopStories
    val widgetTopic = loadPref(context, appWidgetId, PrefKey.Topic) ?: ""
    val widgetTitle = if (widgetChannel == Channel.CustomTopic) widgetTopic else context.resources.getString(if (widgetChannel == Channel.TopStories) R.string.top_stories else R.string.live_feed)
    val widgetUpdateInterval = loadPref(context, appWidgetId, PrefKey.UpdateInterval) ?: "10"

    val views = RemoteViews(context.packageName, R.layout.read_less_app_widget)

    // Fetch results
    thread {
        try {
            val endpoint = buildEndpoint(widgetChannel, widgetTopic)
            val text = URL(endpoint).readText()
            val response = JSONObject(text)
            val rows = response.getJSONArray("rows")
            val builder = RemoteCollectionItems.Builder()
            for (i in 0 until rows.length()) {
                val row = rows.getJSONObject(i)
                val summary = Summary(row)
                val subviews = RemoteViews(context.packageName, R.layout.read_less_app_widget_item)
                val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(summary.deeplink))
                val remoteResponse = RemoteResponse()
                remoteResponse.
                subviews.setOnClickResponse(R.id.appwidget_card, RemoteViews.RemoteResponse())
                subviews.setImageViewUri(R.id.appwidget_card_publisher, summary.getMediaUrl(MediaType.PublisherIcon))
                subviews.setTextViewText(R.id.appwidget_card_header, "${summary.publisher.displayName} • ${distanceFromNow(summary.originalDate)}")
                subviews.setTextViewText(R.id.appwidget_card_title, summary.title)
                subviews.setImageViewUri(R.id.appwidget_card_image, summary.getMediaUrl(MediaType.Image, MediaResolution.SM))
                builder.addItem(summary.id, subviews)
            }
            views.setRemoteAdapter(R.id.appwidget_list_view, builder.build())
            views.setTextViewText(R.id.appwidget_title, widgetTitle)
            appWidgetManager.updateAppWidget(appWidgetId, views)
        } catch (e: Exception) {
            println(e.message)
        }
    }
}