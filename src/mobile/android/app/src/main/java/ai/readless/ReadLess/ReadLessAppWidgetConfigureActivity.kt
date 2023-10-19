package ai.readless.ReadLess

import android.app.Activity
import android.appwidget.AppWidgetManager
import android.content.Context
import android.content.Intent
import android.os.Bundle
import android.view.View
import android.widget.EditText
import ai.readless.ReadLess.databinding.ReadLessAppWidgetConfigureBinding
import android.os.Build
import android.widget.LinearLayout
import android.widget.RadioGroup
import androidx.annotation.RequiresApi

enum class PrefKey {
    Channel, Topic, UpdateInterval
}

enum class Channel {
    TopStories, LiveFeed, CustomTopic
}

/**
 * The configuration screen for the [ReadLessAppWidget] AppWidget.
 */
@RequiresApi(Build.VERSION_CODES.S)
class ReadLessAppWidgetConfigureActivity : Activity() {
    private var appWidgetId = AppWidgetManager.INVALID_APPWIDGET_ID
    private lateinit var appwidgetChannel: RadioGroup
    private lateinit var appwidgetTopicContainer: LinearLayout
    private lateinit var appwidgetTopic: EditText
    private lateinit var appwidgetUpdateInterval: EditText

    private var onCheckChangedListener = RadioGroup.OnCheckedChangeListener { group, checkdId ->
        appwidgetTopicContainer.visibility = if (checkdId == R.id.appwidget_custom_topic) View.VISIBLE else View.GONE
    }

    private var onClickListener = View.OnClickListener {
        val context = this@ReadLessAppWidgetConfigureActivity

        val widgetChannel = if (appwidgetChannel.checkedRadioButtonId == R.id.appwidget_live_feed) Channel.LiveFeed else if (appwidgetChannel.checkedRadioButtonId == R.id.appwidget_custom_topic) Channel.CustomTopic else Channel.TopStories
        savePref(context, appWidgetId, PrefKey.Channel, widgetChannel.name)

        val widgetTopic = appwidgetTopic.text.toString()
        savePref(context, appWidgetId, PrefKey.Topic, widgetTopic)

        val widgetUpdateInterval = appwidgetUpdateInterval.text.toString()
        savePref(context, appWidgetId, PrefKey.UpdateInterval, widgetUpdateInterval)

        // It is the responsibility of the configuration activity to update the app widget
        val appWidgetManager = AppWidgetManager.getInstance(context)
        updateAppWidget(context, appWidgetManager, appWidgetId)

        // Make sure we pass back the original appWidgetId
        val resultValue = Intent()
        resultValue.putExtra(AppWidgetManager.EXTRA_APPWIDGET_ID, appWidgetId)
        setResult(RESULT_OK, resultValue)
        finish()
    }

    private lateinit var binding: ReadLessAppWidgetConfigureBinding

    public override fun onCreate(icicle: Bundle?) {
        super.onCreate(icicle)

        // Set the result to CANCELED.  This will cause the widget host to cancel
        // out of the widget placement if the user presses the back button.
        setResult(RESULT_CANCELED)

        binding = ReadLessAppWidgetConfigureBinding.inflate(layoutInflater)
        setContentView(binding.root)

        appwidgetChannel = binding.appwidgetChannel as RadioGroup
        appwidgetTopicContainer = binding.appwidgetTopicContainer as LinearLayout
        appwidgetTopic = binding.appwidgetTopic as EditText
        appwidgetUpdateInterval = binding.appwidgetUpdateInterval as EditText

        binding.appwidgetChannel.setOnCheckedChangeListener(onCheckChangedListener)
        binding.appwidgetTopicContainer.visibility = if (binding.appwidgetCustomTopic.isChecked) View.VISIBLE else View.GONE
        binding.addButton.setOnClickListener(onClickListener)

        // Find the widget id from the intent.
        val intent = intent
        val extras = intent.extras
        if (extras != null) {
            appWidgetId = extras.getInt(
                    AppWidgetManager.EXTRA_APPWIDGET_ID, AppWidgetManager.INVALID_APPWIDGET_ID)
        }

        // If this activity was started with an intent without an app widget ID, finish with an error.
        if (appWidgetId == AppWidgetManager.INVALID_APPWIDGET_ID) {
            finish()
            return
        }

        val channelStr = loadPref(this@ReadLessAppWidgetConfigureActivity, appWidgetId, PrefKey.Channel)
        val channel = if (channelStr != null) Channel.valueOf(channelStr) else Channel.TopStories
        val channelId = if (channel == Channel.LiveFeed) R.id.appwidget_live_feed else if (channel == Channel.CustomTopic) R.id.appwidget_custom_topic else R.id.appwidget_top_stories

        appwidgetChannel.check(channelId)
        appwidgetTopic.setText(loadPref(this@ReadLessAppWidgetConfigureActivity, appWidgetId, PrefKey.Topic) ?: "")
        appwidgetUpdateInterval.setText(loadPref(this@ReadLessAppWidgetConfigureActivity, appWidgetId, PrefKey.Topic) ?: "10")
    }

}

private const val PREFS_NAME = "ai.readless.ReadLess.ReadLessAppWidget"
private const val PREF_PREFIX_KEY = "appwidget_"

// Write the prefix to the SharedPreferences object for this widget
internal fun savePref(context: Context, appWidgetId: Int, key: PrefKey, text: String) {
    val prefs = context.getSharedPreferences(PREFS_NAME, 0).edit()
    prefs.putString(PREF_PREFIX_KEY + appWidgetId + key.name, text)
    prefs.apply()
}

// Read the prefix from the SharedPreferences object for this widget.
// If there is no preference saved, get the default from a resource
internal fun loadPref(context: Context, appWidgetId: Int, key: PrefKey): String? {
    val prefs = context.getSharedPreferences(PREFS_NAME, 0)
    return prefs.getString(PREF_PREFIX_KEY + appWidgetId + key.name, null)
}

internal fun deletePref(context: Context, appWidgetId: Int, key: PrefKey) {
    val prefs = context.getSharedPreferences(PREFS_NAME, 0).edit()
    prefs.remove(PREF_PREFIX_KEY + appWidgetId + key.name)
    prefs.apply()
}