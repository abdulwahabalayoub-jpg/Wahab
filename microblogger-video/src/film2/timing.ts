export const FPS = 30;
export const LEN = 2700;
/** scene boundaries (absolute frames) */
export const SC = { s1: 0, s2: 250, s3: 500, s4: 1140, s5: 1250, s6: 1780, s7: 1980, s8: 2240, s9: 2420 };
/** voice-over start per line (absolute frames) */
export const VO = [15, 262, 512, 1165, 1262, 1792, 1992, 2250, 2440];
const t = (vo: number, s: number) => Math.round(VO[vo] + s * FPS);
/** captions: [start, end, text] in absolute frames */
export const CAPS: [number, number, string][] = [
  [t(0, 0), t(0, 2.15), "Every campaign used to start the same way."],
  [t(0, 2.93), t(0, 4.04), "Hundreds of DMs…"],
  [t(0, 4.43), t(0, 6.84), "and one very tired marketing team."],
  [t(1, 0), t(1, 1.65), "We'd find bloggers in our messages,"],
  [t(1, 1.86), t(1, 2.98), "chase them for replies,"],
  [t(1, 3.38), t(1, 5.24), "copy every detail into a spreadsheet,"],
  [t(1, 5.8), t(1, 7.69), "then start all over again for the next restaurant."],
  [t(2, 0), t(2, 1.16), "Or we'd pay an agency."],
  [t(2, 1.87), t(2, 4.71), "1,500 KD for 100 bloggers."],
  [t(2, 5.23), t(2, 6.13), "And that's just the fee."],
  [t(2, 6.94), t(2, 8.41), "Every blogger still dines with us."],
  [t(2, 8.89), t(2, 11.12), "A 40 KD table at 70% off"],
  [t(2, 11.36), t(2, 12.52), "is 12 KD each."],
  [t(2, 13.2), t(2, 15.55), "That's another 1,200 KD in food."],
  [t(2, 16.15), t(2, 17.94), "2,700 KD."],
  [t(2, 18.37), t(2, 19.57), "For one campaign."],
  [t(3, 0), t(3, 1.17), "So we built our own."],
  [t(4, 0), t(4, 2.82), "Now, when a blogger messages us, we send one link."],
  [t(4, 3.58), t(4, 4.72), "They apply themselves."],
  [t(4, 5.31), t(4, 7.1), "Their details land straight in our dashboard,"],
  [t(4, 7.1), t(4, 8.88), "and we approve them in one tap."],
  [t(4, 10.03), t(4, 11.75), "Our network grows every single day."],
  [t(4, 12.23), t(4, 12.73), "We own it,"],
  [t(4, 13.1), t(4, 15.7), "and we use it for every brand, and every campaign."],
  [t(5, 0), t(5, 1.73), "Create a campaign for any restaurant,"],
  [t(5, 2.24), t(5, 3.24), "choose your bloggers,"],
  [t(5, 3.7), t(5, 5.51), "and the invitations go out on WhatsApp."],
  [t(6, 0), t(6, 1.53), "Bloggers pick their own date and time,"],
  [t(6, 1.83), t(6, 2.96), "get confirmed instantly,"],
  [t(6, 3.3), t(6, 4.71), "and get a reminder the day before."],
  [t(6, 5.35), t(6, 6.0), "No calls."],
  [t(6, 6.46), t(6, 7.32), "No chasing."],
  [t(7, 0), t(7, 0.67), "Every booking."],
  [t(7, 1.02), t(7, 1.62), "Every visit."],
  [t(7, 2.11), t(7, 2.96), "Every no-show."],
  [t(7, 3.55), t(7, 4.01), "Tracked,"],
  [t(7, 4.37), t(7, 5.68), "with reports for every brand."],
  [t(8, 0), t(8, 1.24), "No more agency fees."],
  [t(8, 1.83), t(8, 3.67), "Just one network that keeps growing."],
  [t(8, 4.43), t(8, 6.44), "This is the Microblogger Dashboard."],
];
/** key moments */
export const M = {
  fee1500: t(2, 1.87), justFee: t(2, 5.23), dines: t(2, 6.94), table40: t(2, 8.89), disc: t(2, 10.2), each12: t(2, 11.36), food1200: t(2, 13.2), total: t(2, 16.15), oneCamp: t(2, 18.37),
  link: t(4, 0.4), apply: t(4, 3.58), land: t(4, 5.31), approve: t(4, 7.6), grows: t(4, 10.03), own: t(4, 12.23), brands: t(4, 13.1),
};
