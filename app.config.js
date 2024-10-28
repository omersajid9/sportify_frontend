module.exports = {
    // use the variable if it's defined, otherwise use the fallback
    BASE_URL: process.env.BASE_URL || "https://omerbackend.store",
    GOOGLE_PLACES_API_KEY: process.env.GOOGLE_PLACES_API_KEY || "AIzaSyDAQ2bdLjVK52X8cu8ZeuLKU_wbl-gcNTs",
    scheme: "myappscheme",
    expo: {
        "extra": {
            "eas": {
                "projectId": "831874f0-a9f3-479f-b9c3-447a845802d7"
            }
        },
        "ios": {
            "bundleIdentifier": "com.omersajid9.tempty"
        },
        "android": {
            "package": "com.omersajid9.tempty"
        }
    }
};