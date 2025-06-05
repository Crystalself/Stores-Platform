const axios = require("axios");
const {OAuth2Client} = require("google-auth-library");
const client = new OAuth2Client(process.env.GOOGLE_AUTH2_CLIENT_ID, process.env.GOOGLE_AUTH2_SECRET);
const path = require("path");
const fs = require("fs");
const imageTypes = ['png', 'jpeg', 'jpg'];
const mimeTypes = ['image/png', 'image/jpeg', 'image/jpg'];
const {object, string} = require('yup');

module.exports = class Helper{
    static yupImgValidation = object()
        .shape({
            name: string().test(
                "fileName",
                "${path} is not valid",
                (value) => value && imageTypes.indexOf(value.slice(((value.lastIndexOf('.') -1 ) >>> 0) + 2 )) !== -1
            ),
            mimetype: string().test(
                "fileName",
                "${path} is not valid",
                (value) => value && mimeTypes.indexOf(value) !== -1
            ),
            size: string().test(
                "size",
                "${path} size is too large",
                (value) => value && (value / (1024 * 1024)) < 5
            ),
        })


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
            if (!url) return;
            const urlPath = (new URL(url)).pathname;
            const urlFsPath = path.join(__dirname, "..", "..", urlPath);
            fs.access(urlFsPath, fs.constants.F_OK, (err) => {
                if (err) {
                    console.warn(`File not found at ${urlFsPath}`);
                    return;
                }
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