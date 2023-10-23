package ai.readless.ReadLess

import android.app.PendingIntent
import android.appwidget.AppWidgetManager
import android.appwidget.AppWidgetProvider
import android.content.Context
import android.content.Intent
import android.content.res.Configuration.UI_MODE_NIGHT_MASK
import android.content.res.Configuration.UI_MODE_NIGHT_YES
import android.graphics.BitmapFactory
import android.net.Uri
import android.os.Build
import android.os.Bundle
import android.widget.RemoteViews
import android.widget.RemoteViews.RemoteCollectionItems
import androidx.annotation.RequiresApi
import org.json.JSONObject
import java.net.URL
import kotlin.concurrent.thread


const val APPWIDGET_CONFIGURE = "android.appwidget.action.APPWIDGET_CONFIGURE"

const val BASE_URL = "https://www.readless.ai"
val DEEPLINKS = mapOf<Channel, String>(
        Channel.TopStories to "$BASE_URL/top",
        Channel.LiveFeed to "$BASE_URL/live",
        Channel.CustomTopic to "$BASE_URL/search?filter="
)

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

    override fun onReceive(context: Context, intent: Intent) {
        if (intent.action == Intent.ACTION_VIEW) {
            val deeplink = intent.getStringExtra("deeplink")
            val browserIntent = Intent(Intent.ACTION_VIEW, Uri.parse(deeplink))
            browserIntent.flags = Intent.FLAG_ACTIVITY_NEW_TASK
            context.startActivity(browserIntent)
        }
        super.onReceive(context, intent)
    }

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
    val dateFormatStr = loadPref(context, appWidgetId, PrefKey.DateFormat)
    val widgetDateFormat = if (dateFormatStr != null) DateFormat.valueOf(dateFormatStr) else DateFormat.Relative

    val views = RemoteViews(context.packageName, R.layout.read_less_app_widget)

    // Title intent
    views.setTextViewText(R.id.appwidget_title, widgetTitle)

    val categoryIntent = Intent(Intent.ACTION_VIEW, Uri.parse(DEEPLINKS[widgetChannel]))
    categoryIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)

    val categoryPendingIntent = PendingIntent.getActivity(context, appWidgetId, categoryIntent, PendingIntent.FLAG_IMMUTABLE)
    views.setOnClickPendingIntent(R.id.appwidget_title, categoryPendingIntent)

    // Config intent and color
    val configIntent = Intent(context, ReadLessAppWidgetConfigureActivity::class.java)
    configIntent.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
    configIntent.action = APPWIDGET_CONFIGURE + appWidgetId.toString()

    val configPendingIntent = PendingIntent.getActivity(context, appWidgetId, configIntent, PendingIntent.FLAG_IMMUTABLE)
    views.setOnClickPendingIntent(R.id.appwidget_settings_cog, configPendingIntent)

    val img = BitmapFactory.decodeResource(context.resources, R.mipmap.cog)
    if (context.resources.configuration.uiMode and UI_MODE_NIGHT_MASK == UI_MODE_NIGHT_YES) {
        views.setImageViewBitmap(R.id.appwidget_settings_cog, invertImage(img))
    } else {
        views.setImageViewBitmap(R.id.appwidget_settings_cog, img)
    }

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
                val intent = Intent()
                intent.putExtra("deeplink", summary.deeplink)
                subviews.setOnClickFillInIntent(R.id.appwidget_card, intent)
                subviews.setImageViewBitmap(R.id.appwidget_card_publisher, summary.getMediaBitmap(MediaType.PublisherIcon))
                val timestr = if (widgetDateFormat == DateFormat.Timestamp) formatDate(summary.originalDate) else distanceFromNow(summary.originalDate)
                subviews.setTextViewText(R.id.appwidget_card_header, "${summary.publisher.displayName} • $timestr")
                subviews.setTextViewText(R.id.appwidget_card_title, summary.title)
                subviews.setImageViewBitmap(R.id.appwidget_card_image, summary.getMediaBitmap(MediaType.Image, MediaResolution.SM))
                builder.addItem(summary.id, subviews)
            }

            val adapter = builder.build()
            views.setRemoteAdapter(R.id.appwidget_list_view, adapter)

            // Setup item handler
            val broadcastIntent = Intent(context, ReadLessAppWidget::class.java)
            broadcastIntent.action = Intent.ACTION_VIEW
            val flag = if (Build.VERSION.SDK_INT >= Build.VERSION_CODES.S) {
                PendingIntent.FLAG_UPDATE_CURRENT or PendingIntent.FLAG_MUTABLE
            } else {
                PendingIntent.FLAG_UPDATE_CURRENT
            }
            val pendingBroadcastIntent = PendingIntent.getBroadcast(context, 0, broadcastIntent, flag)
            views.setPendingIntentTemplate(R.id.appwidget_list_view, pendingBroadcastIntent)

            appWidgetManager.updateAppWidget(appWidgetId, views)
        } catch (e: Exception) {
            println(e.message)
        }
    }
}