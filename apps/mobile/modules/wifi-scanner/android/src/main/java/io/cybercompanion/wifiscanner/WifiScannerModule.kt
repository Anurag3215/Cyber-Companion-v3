package io.cybercompanion.wifiscanner

import android.content.Context
import android.location.LocationManager
import android.net.wifi.ScanResult
import android.net.wifi.WifiManager
import androidx.core.location.LocationManagerCompat
import expo.modules.kotlin.Promise
import expo.modules.kotlin.modules.Module
import expo.modules.kotlin.modules.ModuleDefinition

class WifiScannerModule : Module() {
  override fun definition() = ModuleDefinition {
    Name("WifiScanner")

    Function("isLocationEnabled") {
      val context = appContext.reactContext ?: return@Function false
      val locationManager = context.getSystemService(Context.LOCATION_SERVICE) as? LocationManager
        ?: return@Function false
      LocationManagerCompat.isLocationEnabled(locationManager)
    }

    AsyncFunction("startScan") { promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.resolve(false)
        return@AsyncFunction
      }

      val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
      if (wifiManager == null) {
        promise.resolve(false)
        return@AsyncFunction
      }

      try {
        @Suppress("DEPRECATION")
        val initiated = wifiManager.startScan()
        promise.resolve(initiated)
      } catch (e: Exception) {
        promise.resolve(false)
      }
    }

    AsyncFunction("getScanResults") { promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.resolve(emptyList<Map<String, Any>>())
        return@AsyncFunction
      }

      val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
      if (wifiManager == null) {
        promise.resolve(emptyList<Map<String, Any>>())
        return@AsyncFunction
      }

      try {
        val results: List<ScanResult> = wifiManager.scanResults ?: emptyList()
        val mapped = results.map { scan ->
          val map = mutableMapOf<String, Any>()
          val ssid = scan.SSID ?: ""
          map["ssid"] = ssid.removePrefix("\"").removeSuffix("\"")
          map["bssid"] = scan.BSSID ?: "00:00:00:00:00:00"
          map["level"] = scan.level
          map["frequency"] = scan.frequency
          map["capabilities"] = scan.capabilities ?: ""
          map["timestamp"] = scan.timestamp
          map
        }
        promise.resolve(mapped)
      } catch (e: Exception) {
        promise.resolve(emptyList<Map<String, Any>>())
      }
    }

    AsyncFunction("getCurrentWifiInfo") { promise: Promise ->
      val context = appContext.reactContext
      if (context == null) {
        promise.resolve(null)
        return@AsyncFunction
      }

      val wifiManager = context.applicationContext.getSystemService(Context.WIFI_SERVICE) as? WifiManager
      if (wifiManager == null) {
        promise.resolve(null)
        return@AsyncFunction
      }

      try {
        @Suppress("DEPRECATION")
        val info = wifiManager.connectionInfo
        if (info == null || info.networkId == -1) {
          promise.resolve(null)
          return@AsyncFunction
        }

        val rawSsid = info.ssid ?: ""
        val ssid = rawSsid.removePrefix("\"").removeSuffix("\"")
        if (ssid == "<unknown ssid>" || ssid == "0x" || ssid.isEmpty()) {
          promise.resolve(null)
          return@AsyncFunction
        }

        val map = mutableMapOf<String, Any>()
        map["ssid"] = ssid
        map["bssid"] = info.bssid ?: ""
        map["level"] = info.rssi
        map["frequency"] = info.frequency
        map["ipAddress"] = formatIpAddress(info.ipAddress)
        promise.resolve(map)
      } catch (e: Exception) {
        promise.resolve(null)
      }
    }
  }

  private fun formatIpAddress(ip: Int): String {
    return if (ip == 0) {
      ""
    } else {
      String.format(
        "%d.%d.%d.%d",
        ip and 0xff,
        ip shr 8 and 0xff,
        ip shr 16 and 0xff,
        ip shr 24 and 0xff
      )
    }
  }
}
