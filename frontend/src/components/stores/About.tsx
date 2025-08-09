"use client";

import React from "react";
import {
  Avatar,
  Box,
  Chip,
  Divider,
  Stack,
  Typography,
  useTheme,
} from "@mui/material";
import VerifiedIcon from "@mui/icons-material/Verified";
import EmailIcon from "@mui/icons-material/Email";
import PhoneIcon from "@mui/icons-material/Phone";
import AccountBalanceIcon from "@mui/icons-material/AccountBalance";
import NumbersIcon from "@mui/icons-material/Numbers";
import PersonIcon from "@mui/icons-material/Person";
import InfoIcon from "@mui/icons-material/Info";
import { useTranslations } from "next-intl";
import { User } from "@/models/user";

interface AboutProps {
  seller: User;
}

const About: React.FC<AboutProps> = ({ seller }) => {
  const t = useTranslations();
  const theme = useTheme();

  return (
    <Box p={2}>
      <Stack direction={{ xs: "column", md: "row" }} spacing={4}>
        {/* صورة الملف الشخصي */}
        <Box>
          <Avatar
            src={seller.profilePic}
            alt={seller.firstName + " " + seller.lastName}
            sx={{ width: 120, height: 120, border: `2px solid ${theme.palette.primary.main}` }}
          />
        </Box>

        <Box flex={1}>
          <Stack spacing={1}>
            {/* اسم صاحب المتجر */}
            <Typography variant="h6">
              <PersonIcon fontSize="small" sx={{ mr: 1 }} />
              {seller.firstName} {seller.lastName}
            </Typography>

            {/* رقم الهاتف / الايميل */}
            <Typography variant="body1">
              {seller.phone ? (
                <>
                  <PhoneIcon fontSize="small" sx={{ mr: 1 }} /> {seller.phone}
                </>
              ) : (
                <>
                  <EmailIcon fontSize="small" sx={{ mr: 1 }} /> {seller.email}
                </>
              )}
            </Typography>

            {/* حالة التوثيق */}
            {seller.verified && (
              <Chip
                icon={<VerifiedIcon />}
                label={t("verified")}
                color="success"
                size="small"
                sx={{ width: "fit-content" }}
              />
            )}

            <Divider />

            {/* بيانات البنك */}
            {seller.bankName && (
              <Typography variant="body2">
                <AccountBalanceIcon fontSize="small" sx={{ mr: 1 }} /> {seller.bankName}
              </Typography>
            )}
            {seller.bankAccount && (
              <Typography variant="body2">
                <NumbersIcon fontSize="small" sx={{ mr: 1 }} /> {seller.bankAccount}
              </Typography>
            )}

            {/* نوع الحساب */}
            <Typography variant="body2">
              <InfoIcon fontSize="small" sx={{ mr: 1 }} /> {t(seller.role)}
            </Typography>

            {/* نبذة عن المتجر */}
            {seller.bio && (
              <Box mt={2}>
                <Typography variant="body1" fontWeight={500} gutterBottom>
                  {t("bio")}
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  {seller.bio}
                </Typography>
              </Box>
            )}
          </Stack>
        </Box>
      </Stack>
    </Box>
  );
};

export default About;
