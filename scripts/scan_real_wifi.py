import ctypes
from ctypes import wintypes
import time

wlan = ctypes.windll.wlanapi

class GUID(ctypes.Structure):
    _fields_ = [
        ('Data1', wintypes.DWORD),
        ('Data2', wintypes.WORD),
        ('Data3', wintypes.WORD),
        ('Data4', ctypes.c_byte * 8)
    ]

class WLAN_INTERFACE_INFO(ctypes.Structure):
    _fields_ = [
        ('InterfaceGuid', GUID),
        ('strInterfaceDescription', ctypes.c_wchar * 256),
        ('isState', wintypes.DWORD)
    ]

class WLAN_INTERFACE_INFO_LIST(ctypes.Structure):
    _fields_ = [
        ('dwNumberOfItems', wintypes.DWORD),
        ('dwIndex', wintypes.DWORD),
        ('InterfaceInfo', WLAN_INTERFACE_INFO * 1)
    ]

class DOT11_SSID(ctypes.Structure):
    _fields_ = [
        ('uSSIDLength', wintypes.ULONG),
        ('ucSSID', ctypes.c_char * 32)
    ]

class WLAN_BSS_ENTRY(ctypes.Structure):
    _fields_ = [
        ('dot11Ssid', DOT11_SSID),
        ('uPhyId', wintypes.ULONG),
        ('dot11Bssid', ctypes.c_ubyte * 6),
        ('dot11BssType', wintypes.DWORD),
        ('dot11BssPhyType', wintypes.DWORD),
        ('lRssi', ctypes.c_long),
        ('uLinkQuality', wintypes.ULONG),
        ('bInRegDomain', wintypes.BOOL),
        ('usBeaconPeriod', wintypes.WORD),
        ('ullTimestamp', ctypes.c_ulonglong),
        ('ullHostTimestamp', ctypes.c_ulonglong),
        ('usCapabilityInformation', wintypes.WORD),
        ('ulChCenterFrequency', wintypes.ULONG),
        ('wlanRateSet', ctypes.c_byte * 256),
        ('ulIeOffset', wintypes.ULONG),
        ('ulIeSize', wintypes.ULONG),
    ]

class WLAN_BSS_LIST(ctypes.Structure):
    _fields_ = [
        ('dwTotalSize', wintypes.DWORD),
        ('dwNumberOfItems', wintypes.DWORD),
        ('wlanBssEntries', WLAN_BSS_ENTRY * 1)
    ]

handle = wintypes.HANDLE()
negotiated_version = wintypes.DWORD()
ret = wlan.WlanOpenHandle(2, None, ctypes.byref(negotiated_version), ctypes.byref(handle))
if ret != 0:
    print('Failed open handle:', ret)
    exit(1)

pInterfaceList = ctypes.POINTER(WLAN_INTERFACE_INFO_LIST)()
ret = wlan.WlanEnumInterfaces(handle, None, ctypes.byref(pInterfaceList))
if ret != 0:
    print('Failed enum interfaces:', ret)
    exit(1)

info = pInterfaceList.contents.InterfaceInfo[0]
guid = info.InterfaceGuid

# Trigger hardware scan
wlan.WlanScan(handle, ctypes.byref(guid), None, None, None)
time.sleep(2)

pBssList = ctypes.POINTER(WLAN_BSS_LIST)()
ret = wlan.WlanGetNetworkBssList(handle, ctypes.byref(guid), None, 1, 0, None, ctypes.byref(pBssList))

if ret == 0:
    count = pBssList.contents.dwNumberOfItems
    print(f'REAL PHYSICAL HARDWARE BSSID AIRSPACE BEACONS: {count}')
    
    class FULL_BSS_LIST(ctypes.Structure):
        _fields_ = [
            ('dwTotalSize', wintypes.DWORD),
            ('dwNumberOfItems', wintypes.DWORD),
            ('wlanBssEntries', WLAN_BSS_ENTRY * max(1, count))
        ]
    full = ctypes.cast(pBssList, ctypes.POINTER(FULL_BSS_LIST)).contents
    
    seen = set()
    for i in range(count):
        entry = full.wlanBssEntries[i]
        ssid_len = entry.dot11Ssid.uSSIDLength
        ssid = entry.dot11Ssid.ucSSID[:ssid_len].decode('utf-8', errors='ignore') or '[Hidden SSID]'
        bssid = ':'.join(f'{b:02x}' for b in entry.dot11Bssid)
        rssi = entry.lRssi
        quality = entry.uLinkQuality
        freq_khz = entry.ulChCenterFrequency
        freq_mhz = freq_khz // 1000 if freq_khz > 100000 else freq_khz
        
        band = '5.0 GHz' if freq_mhz > 5000 else '2.4 GHz'
        key = (ssid, bssid)
        if key not in seen:
            seen.add(key)
            print(f'SSID: \"{ssid}\" | BSSID: {bssid} | Signal: {rssi} dBm ({quality}%) | Freq: {band} ({freq_mhz} MHz)')

wlan.WlanCloseHandle(handle, None)
