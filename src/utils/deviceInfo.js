const UAParser = require("ua-parser-js");

const getDeviceInfo = (req) => {
    const parser = new UAParser(
        req.headers["user-agent"] || ""
    );

    const browser = parser.getBrowser();
    const os = parser.getOS();
    const device = parser.getDevice();

    let deviceInfo = null;

    try {
        const encoded = req.header("X-Device-Info");

        if (encoded) {
            const parsed = JSON.parse(
                Buffer.from(encoded, "base64").toString("utf-8")
            );

            if (
                typeof parsed === "object" &&
                parsed !== null &&
                !Array.isArray(parsed)
            ) {
                deviceInfo = parsed;
            }
        }
    } catch {
        // Fall back to User-Agent information.
    }

    const manufacturer =
        deviceInfo?.manufacturer ?? device.vendor ?? null;

    const modelName =
        deviceInfo?.modelName ?? device.model ?? null;

    const osName =
        deviceInfo?.osName ?? os.name ?? null;

    const osVersion =
        deviceInfo?.osVersion ?? os.version ?? null;

    return {
        browser: deviceInfo ? null : browser,

        device: {
            ...device,
            vendor: manufacturer ?? undefined,
            model: modelName ?? undefined,
        },

        deviceId:
            deviceInfo?.deviceId ??
            req.header("deviceid") ??
            null,

        deviceName:
            deviceInfo?.deviceName ??
            (
                [manufacturer, modelName]
                    .filter(Boolean)
                    .join(" ") ||
                [browser.name, osName]
                    .filter(Boolean)
                    .join(" on ") ||
                "Unknown device"
            ),

        manufacturer,
        modelName,

        brand:
            deviceInfo?.brand ?? manufacturer,

        os: {
            ...os,
            name: osName ?? undefined,
            version: osVersion ?? undefined,
        },

        osName,
        osVersion,

        ip: req.ip ?? "",
    };
};

module.exports = getDeviceInfo;