const axios = require("axios");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_AUTH2_CLIENT_ID, process.env.GOOGLE_AUTH2_SECRET);
const path = require("path");
const fs = require("fs");
module.exports = class Helper{
    static getIpInfo = async (ip) => {
        try {
            const {data} = await axios.get(`https://ipapi.co/${ip}/json`);
            const response2 = await axios.get(`https://ip-api.io/api/v1/ip/${ip}`);
            return {
                city: response2?.data?.location?.city ?? data?.city ?? null,
                countryCode: response2?.data?.location?.country_code ?? data?.country_code ?? null,
                countryName: response2?.data?.location?.country ?? data?.country_name ?? null,
                regionName: data?.region ?? null,
                regionCode: data?.region_code ?? null,
                zipCode: response2?.data?.location?.zip ?? data?.postal ?? null,
                timeZone: data?.timezone ?? null,
                organisation: data?.org ?? null,
                latitude: response2?.data?.location?.latitude ?? null,
                longitude: response2?.data?.location?.longitude ?? null,
                suspiciousFactors: response2?.data?.data?.suspicious_factors ?? []
            };
        } catch (error) {
            return {};
        }
    };

    static googleAuth2 = async (idToken) => {
        try {
            const ticket = await client.verifyIdToken({idToken, audience: process.env.GOOGLE_AUTH2_CLIENT_ID});
            return ticket.getPayload();
        } catch (error) {
            console.error(error);
            return false;
        }

    }

    static removeFileByUrl = async (url) => {
        try {
            // Skip if URL is not provided
            if (!url) {
                return;
            }

            // Parse the URL path
            const urlPath = (new URL(url)).pathname;

            // Create absolute path to the file using project root
            const urlFsPath = path.join(__dirname, "..", "..", urlPath);

            // Check if file exists before attempting to delete
            fs.access(urlFsPath, fs.constants.F_OK, (err) => {
                if (err) {
                    // File does not exist, log and return
                    console.warn(`File not found at ${urlFsPath}`);
                    return;
                }

                // File exists, attempt to delete
                fs.unlink(urlFsPath, (unlinkErr) => {
                    if (unlinkErr) {
                        console.error(`Error unlinking file at ${urlFsPath}:`, unlinkErr);
                    }
                });
            });
        } catch (error) {
            console.error("Error removing file by URL:", error);
        }
    }

};