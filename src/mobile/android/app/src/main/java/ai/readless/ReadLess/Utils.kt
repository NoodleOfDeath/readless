package ai.readless.ReadLess

import android.graphics.Bitmap
import android.graphics.BitmapFactory
import android.graphics.Color
import java.net.URL


fun urlToBitmap(url: String?): Bitmap? {
    if (url == null) return null;
    return urlToBitmap(URL(url))
}

fun urlToBitmap(url: URL?): Bitmap? {
    if (url == null) return null;
    val options = BitmapFactory.Options()
    options.inMutable = true
    val data = url.readBytes()
    return BitmapFactory.decodeByteArray(data, 0, data.size, options)
}

fun invertImage(src: Bitmap): Bitmap? {
    // create new bitmap with the same attributes(width,height)
    //as source bitmap
    val bmOut = Bitmap.createBitmap(src.width, src.height, src.config)
    // color info
    var a: Int
    var r: Int
    var g: Int
    var b: Int
    var pixelColor: Int
    // image size
    val height = src.height
    val width = src.width
    // scan through every pixel
    for (y in 0 until height) {
        for (x in 0 until width) {
            // get one pixel
            pixelColor = src.getPixel(x, y)
            // saving alpha channel
            a = Color.alpha(pixelColor)
            // inverting byte for each R/G/B channel
            r = 255 - Color.red(pixelColor)
            g = 255 - Color.green(pixelColor)
            b = 255 - Color.blue(pixelColor)
            // set newly-inverted pixel to output image
            bmOut.setPixel(x, y, Color.argb(a, r, g, b))
        }
    }
    return bmOut
}