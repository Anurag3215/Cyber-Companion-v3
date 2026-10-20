module.exports = {
  getNetworkStateAsync: async () => ({
    isConnected: true,
    type: 'WIFI',
    isInternetReachable: true,
  }),
  getIpAddressAsync: async () => '192.168.1.100',
  isAirplaneModeEnabledAsync: async () => false,
  NetworkStateType: {
    WIFI: 'WIFI',
    CELLULAR: 'CELLULAR',
    NONE: 'NONE',
    UNKNOWN: 'UNKNOWN',
  },
};
