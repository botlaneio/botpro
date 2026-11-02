import { useId } from "react"

import { cn } from "@/lib/utils"

// The Botlane seal: a dark glass disc holding the circuit bolt, with rings of broken arcs round it. Light falls from
// above and short arcs of light travel round the edge, as on surface-apex, one for each product lane. All coordinates share one space
// with the disc's centre at 0,0, so the beams can turn about the origin. The rings read --neutral-12 and the lane colours
// read their own tokens, so the seal follows the theme; the disc stays dark in both themes, like a button that keeps its own material.
const R = 376
const REACH = 590   // half the canvas with the rings on
const NEAT = R + 2  // half the canvas with the rings off
const LINE = 18.92     // the bolt's line width
const ICON = "M-1.7 -199.3L-1.7 -145.1L36.5 -107.3L-17.2 -41.9L14.6 -17.8L-39.1 47.5L-0.9 85.3L-0.9 139.5M-0.9 196.3L-0.9 259.1M-1.7 -145.1L-118.2 -29.9L-198.6 -29.9M-0.9 85.3L115.7 -29.9L196.1 -29.9M-118.2 -29.9L-71.8 14.8L-152.2 100.8M115.7 -29.9L69.2 -74.6L149.6 -160.6M-215.0 -161.0L-143.2 -161.0L-64.5 -82.3M212.4 101.3L140.6 101.3L61.9 22.6M-30.1 -227.7a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM-29.2 167.9a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM-255.4 -29.9a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM196.1 -29.9a28.4 28.4 0 1 0 56.8 0a28.4 28.4 0 1 0 -56.8 0ZM-227.5 133.5a44.7 44.7 0 1 0 89.4 0a44.7 44.7 0 1 0 -89.4 0ZM135.4 -193.3a44.7 44.7 0 1 0 89.4 0a44.7 44.7 0 1 0 -89.4 0Z"
const BOLT = "M-1.7 -145.1L36.5 -107.3L-17.2 -41.9L14.6 -17.8L-39.1 47.5L-0.9 85.3"  // the spine's zigzag alone, for the tiny size
const TRACES = "M105.3 -297.8L70.9 -263.4L70.9 -179.5L51.6 -160.2L51.6 -133.1M283.8 -99.1L182.7 -99.1L159.1 -77.6L111.8 -77.6M283.8 53.5L167.7 53.5L144.0 31.2L111.8 31.2M-105.3 297.8L-77.4 272.0L-77.4 149.4L-43.9 115.9L-43.9 95.7M101.9 297.8L74.0 272.0L74.0 149.4L48.2 125.8L48.2 84.9"
const RINGS = "M147.9 -499.6C157.6 -496.1 187.4 -486.9 206.4 -478.9C225.4 -470.8 244.1 -461.4 262.0 -451.1C279.9 -440.8 305.3 -422.6 313.9 -416.9M105.8 -491.2C114.3 -489.0 139.8 -483.1 156.4 -477.8C173.0 -472.5 189.4 -466.2 205.3 -459.1C221.2 -452.1 236.9 -444.2 252.0 -435.5C267.1 -426.8 281.8 -417.3 296.0 -407.0C310.1 -396.8 323.8 -385.8 336.7 -374.2C349.7 -362.5 362.2 -350.1 373.9 -337.2C385.6 -324.3 396.7 -310.6 406.9 -296.5C417.2 -282.5 426.8 -267.8 435.6 -252.7C444.4 -237.6 452.4 -222.0 459.5 -206.0C466.7 -190.1 473.0 -173.7 478.5 -157.2C483.9 -140.6 488.5 -123.6 492.2 -106.6C495.9 -89.5 499.2 -63.5 500.6 -54.8M16.5 -482.7C23.7 -482.2 46.8 -481.1 60.0 -479.7C73.3 -478.3 84.0 -476.6 95.8 -474.3C107.6 -472.1 125.2 -467.6 131.1 -466.3M-350.8 -351.9C-342.3 -359.5 -316.8 -384.0 -299.6 -397.4C-282.4 -410.9 -265.5 -422.0 -247.4 -432.7C-229.3 -443.3 -200.5 -456.5 -191.1 -461.3M289.0 -455.9C296.4 -450.7 319.3 -435.9 333.7 -424.8C348.0 -413.6 361.8 -401.7 375.0 -389.2C388.1 -376.6 400.6 -363.3 412.4 -349.5C424.2 -335.7 435.3 -321.2 445.6 -306.2C455.9 -291.2 465.5 -275.7 474.3 -259.7C483.0 -243.8 490.9 -227.3 498.0 -210.6C505.0 -193.8 511.3 -176.6 516.6 -159.3C521.9 -141.9 526.3 -124.2 529.8 -106.4C533.3 -88.5 535.9 -70.5 537.6 -52.4C539.3 -34.3 540.0 -16.1 539.9 2.1C539.7 20.2 538.6 38.4 536.6 56.5C534.6 74.5 531.6 92.5 527.8 110.2C524.0 127.9 519.2 145.5 513.6 162.7C508.0 179.9 501.5 196.9 494.2 213.5C486.9 230.0 478.7 246.3 469.7 262.0C460.8 277.7 451.0 293.0 440.5 307.7C430.0 322.4 418.8 336.6 406.9 350.2C395.0 363.7 382.3 376.8 369.1 389.0C355.9 401.3 342.0 413.0 327.7 423.8C313.3 434.7 298.4 444.9 283.0 454.2C267.7 463.6 251.7 472.2 235.5 480.0C219.3 487.7 202.7 494.7 185.8 500.8C168.9 506.8 151.6 512.1 134.2 516.4C116.8 520.8 99.1 524.2 81.4 526.8C63.7 529.4 45.7 531.0 27.8 531.8C10.0 532.6 -8.0 532.5 -25.9 531.4C-43.7 530.4 -61.6 528.5 -79.3 525.7C-96.9 522.9 -114.5 519.2 -131.7 514.6C-149.0 510.1 -166.1 504.6 -182.8 498.4C-199.5 492.1 -216.0 485.0 -232.0 477.1C-248.0 469.2 -263.6 460.5 -278.7 451.0C-293.8 441.6 -308.5 431.3 -322.6 420.4C-336.7 409.6 -350.3 397.9 -363.3 385.7C-376.2 373.4 -388.6 360.5 -400.2 347.0C-411.8 333.5 -422.8 319.4 -433.1 304.9C-443.3 290.3 -452.9 275.2 -461.6 259.7C-470.4 244.2 -478.4 228.1 -485.5 211.8C-492.7 195.5 -501.4 170.2 -504.6 161.9M3.0 -450.2C6.0 -450.2 15.0 -450.2 21.0 -450.0C27.0 -449.8 31.8 -449.6 39.1 -449.0C46.3 -448.5 60.3 -447.0 64.6 -446.7M388.5 226.9C384.5 233.1 372.9 252.0 364.2 264.0C355.6 275.9 346.3 287.5 336.5 298.5C326.6 309.5 316.3 320.1 305.4 330.1C294.6 340.2 283.2 349.7 271.4 358.6C259.6 367.5 247.4 375.8 234.8 383.5C222.2 391.2 209.2 398.3 195.9 404.8C182.6 411.2 169.0 417.0 155.1 422.1C141.3 427.2 127.1 431.6 112.8 435.3C98.5 439.0 84.0 442.0 69.4 444.3C54.9 446.6 40.1 448.1 25.4 449.0C10.6 449.8 -4.2 449.9 -18.9 449.3C-33.7 448.7 -48.5 447.4 -63.1 445.3C-77.7 443.2 -92.3 440.5 -106.6 437.0C-120.9 433.5 -135.2 429.3 -149.1 424.4C-163.0 419.5 -176.8 413.9 -190.2 407.7C-203.5 401.5 -216.7 394.5 -229.4 387.0C-242.1 379.5 -254.5 371.3 -266.4 362.6C-278.3 353.9 -289.8 344.5 -300.8 334.7C-311.8 324.8 -322.4 314.4 -332.3 303.5C-342.3 292.6 -351.8 281.1 -360.6 269.3C-369.5 257.5 -377.8 245.2 -385.4 232.5C-393.1 219.9 -400.1 206.8 -406.5 193.5C-412.8 180.2 -418.6 166.5 -423.6 152.6C-428.6 138.7 -433.0 124.5 -436.6 110.2C-440.2 95.8 -443.2 81.3 -445.4 66.7C-447.6 52.1 -449.0 37.3 -449.8 22.5C-450.5 7.8 -450.6 -7.1 -449.9 -21.9C-449.2 -36.6 -447.7 -51.4 -445.6 -66.0C-443.4 -80.7 -440.5 -95.2 -436.9 -109.6C-433.3 -123.9 -429.0 -138.1 -424.1 -152.1C-419.1 -166.0 -413.4 -179.7 -407.0 -193.1C-400.7 -206.4 -393.7 -219.5 -386.1 -232.2C-378.5 -244.9 -370.2 -257.2 -361.4 -269.1C-352.5 -280.9 -343.1 -292.4 -333.1 -303.3C-323.2 -314.3 -312.6 -324.7 -301.7 -334.6C-290.7 -344.5 -279.1 -353.9 -267.2 -362.7C-255.3 -371.4 -242.9 -379.7 -230.2 -387.2C-217.5 -394.8 -204.4 -401.7 -191.0 -408.0C-177.6 -414.2 -156.8 -421.9 -149.9 -424.7M-198.0 -369.9C-190.1 -373.5 -167.0 -385.4 -150.9 -391.6C-134.8 -397.8 -118.2 -403.1 -101.5 -407.3C-84.7 -411.5 -67.6 -414.7 -50.5 -416.8C-33.3 -418.9 -15.9 -419.9 1.3 -419.8C18.6 -419.7 44.4 -416.9 53.0 -416.3M1.0 -404.2C11.6 -403.3 43.8 -402.5 64.8 -399.1C85.8 -395.7 106.8 -390.4 126.9 -383.7C147.1 -377.0 176.1 -363.0 185.9 -358.8M-396.8 77.0C-397.8 69.4 -401.8 46.7 -402.9 31.5C-404.1 16.2 -404.4 0.8 -403.9 -14.4C-403.3 -29.7 -401.9 -45.0 -399.6 -60.2C-397.3 -75.3 -394.1 -90.3 -390.1 -105.1C-386.2 -119.8 -381.3 -134.4 -375.7 -148.6C-370.1 -162.9 -363.6 -176.8 -356.4 -190.3C-349.2 -203.8 -341.2 -216.9 -332.6 -229.5C-323.9 -242.1 -314.5 -254.3 -304.4 -265.8C-294.4 -277.3 -284.6 -287.8 -272.4 -298.7C-260.2 -309.6 -238.2 -325.9 -231.4 -331.3M285.5 -308.1C292.1 -300.9 313.4 -279.2 325.2 -264.9C336.9 -250.5 346.5 -237.0 355.8 -222.1C365.0 -207.3 376.5 -183.5 380.6 -175.8M-362.7 -210.8C-359.3 -216.1 -349.5 -232.4 -342.2 -242.7C-335.0 -252.9 -327.2 -262.9 -319.0 -272.6C-310.9 -282.2 -297.6 -295.7 -293.3 -300.3M-431.3 -58.0C-429.0 -68.7 -423.7 -101.0 -417.6 -121.8C-411.4 -142.6 -403.7 -163.2 -394.5 -182.9C-385.4 -202.6 -368.2 -230.4 -362.9 -239.9M380.9 -240.0C384.6 -233.4 396.3 -214.2 403.0 -200.7C409.7 -187.3 415.4 -174.5 421.0 -159.5C426.6 -144.5 434.0 -119.0 436.6 -110.9M-475.1 -18.0C-473.7 -30.5 -471.5 -68.5 -466.8 -93.2C-462.1 -117.9 -455.5 -142.6 -446.9 -166.2C-438.4 -189.9 -420.7 -223.8 -415.5 -235.3M476.2 -92.0C477.5 -82.1 482.6 -52.4 483.9 -32.5C485.2 -12.5 485.2 7.6 483.9 27.6C482.6 47.5 480.0 67.5 476.2 87.1C472.5 106.7 463.8 135.4 461.3 145.1M514.1 -90.0C515.2 -80.4 519.5 -51.4 520.6 -32.1C521.6 -12.7 521.6 6.9 520.5 26.2C519.4 45.6 517.2 65.0 513.9 84.1C510.7 103.2 506.3 122.2 501.0 140.8C495.6 159.4 489.1 177.8 481.7 195.7C474.3 213.6 465.8 231.1 456.5 248.0C447.1 264.9 436.7 281.4 425.5 297.1C414.4 312.9 402.2 328.1 389.3 342.4C376.5 356.8 362.7 370.5 348.3 383.4C333.9 396.2 318.7 408.2 303.0 419.4C287.3 430.5 262.2 444.9 254.0 450.0M-529.9 -19.0C-529.7 -22.9 -529.3 -34.5 -528.7 -42.2C-528.2 -50.0 -527.5 -56.8 -526.5 -65.4C-525.6 -73.9 -523.5 -88.9 -522.9 -93.6M-440.4 221.7C-444.5 212.2 -457.9 184.3 -464.9 165.0C-471.8 145.6 -477.5 125.6 -482.0 105.6C-486.4 85.5 -489.6 65.0 -491.5 44.5C-493.4 24.0 -494.1 3.2 -493.5 -17.3C-492.9 -37.9 -488.8 -68.7 -487.9 -79.0M-347.7 233.8C-351.7 227.2 -364.4 207.8 -371.5 194.2C-378.7 180.6 -385.2 166.5 -390.8 152.2C-396.4 137.9 -401.3 123.1 -405.3 108.3C-409.2 93.4 -412.4 78.2 -414.7 63.0C-417.0 47.8 -418.5 32.4 -419.1 17.0C-419.8 1.6 -419.5 -13.9 -418.5 -29.2C-417.4 -44.6 -413.7 -67.5 -412.8 -75.1M403.4 -1.5C403.1 4.5 402.8 23.5 401.9 34.5C401.1 45.6 399.8 54.8 398.2 64.8C396.6 74.9 393.2 89.8 392.3 94.8M412.2 75.0C410.5 82.2 406.2 103.7 402.1 117.7C398.0 131.7 393.1 145.6 387.5 159.1C382.0 172.6 375.7 185.8 368.8 198.7C361.8 211.5 354.2 224.1 346.0 236.1C337.7 248.2 328.8 259.9 319.4 271.0C309.9 282.1 299.8 292.8 289.3 302.9C278.7 313.0 267.6 322.5 256.0 331.5C244.5 340.4 232.4 348.7 220.0 356.4C207.6 364.1 194.7 371.1 181.5 377.4C168.4 383.7 154.8 389.4 141.1 394.3C127.3 399.2 113.3 403.5 99.1 406.9C84.9 410.4 63.2 413.7 56.0 415.0M420.6 108.9C418.0 117.2 411.0 142.4 404.6 158.5C398.3 174.7 390.9 190.6 382.7 205.8C374.4 221.1 359.7 242.7 355.1 250.1M-193.1 353.7C-201.9 348.2 -229.8 332.3 -245.7 320.4C-261.5 308.6 -275.1 296.1 -288.4 282.6C-301.6 269.0 -313.9 254.3 -325.2 239.0C-336.5 223.8 -350.8 199.0 -355.9 190.9M85.0 425.8C76.9 426.9 52.8 431.2 36.6 432.6C20.4 433.9 4.1 434.4 -12.2 433.9C-28.4 433.5 -44.7 432.1 -60.8 429.8C-76.9 427.6 -92.9 424.4 -108.6 420.3C-124.4 416.3 -140.0 411.3 -155.2 405.5C-170.3 399.8 -185.3 393.1 -199.7 385.6C-214.2 378.2 -228.3 369.9 -241.8 360.8C-255.3 351.8 -268.4 342.0 -280.8 331.5C-293.2 321.0 -305.1 309.7 -316.3 297.9C-327.4 286.1 -338.0 273.5 -347.7 260.5C-357.5 247.5 -370.3 226.6 -374.8 219.9M-257.9 420.8C-264.0 416.6 -283.0 404.4 -294.9 395.4C-306.8 386.5 -318.3 376.9 -329.4 366.9C-340.5 356.9 -356.1 340.7 -361.4 335.4M83.9 394.6C75.7 395.8 51.2 400.3 34.7 401.7C18.2 403.1 1.5 403.5 -15.0 402.9C-31.6 402.3 -48.2 400.7 -64.5 398.1C-80.9 395.5 -105.0 389.1 -113.1 387.3M270.9 418.9C262.9 423.3 239.4 437.4 223.0 445.4C206.6 453.3 189.7 460.4 172.5 466.5C155.4 472.6 137.8 477.8 120.2 482.1C102.5 486.3 84.5 489.6 66.5 491.8C48.5 494.1 30.2 495.4 12.1 495.6C-6.0 495.9 -24.3 495.1 -42.3 493.4C-60.3 491.6 -87.1 486.5 -96.0 485.1M-77.0 507.3C-89.7 504.3 -128.2 497.1 -152.9 489.2C-177.6 481.3 -202.0 471.4 -225.2 459.9C-248.4 448.4 -280.9 426.7 -292.1 420.1"
const WORD = "M357 12Q301.2 12 259.4 -12.1Q217.6 -36.2 194.6 -79.2L191.6 0H70.4V-710H198.4V-458.4Q219.6 -494.6 260.8 -520.3Q302 -546 357 -546Q425.8 -546 476.2 -511.6Q526.6 -477.2 554.2 -414.6Q581.8 -352 581.8 -267Q581.8 -182 554.2 -119.4Q526.6 -56.8 476.2 -22.4Q425.8 12 357 12ZM327.6 -91.6Q383 -91.6 416.2 -138.2Q449.4 -184.8 449.4 -267Q449.4 -349.8 416.6 -396.1Q383.8 -442.4 328.8 -442.4Q287.8 -442.4 258.4 -421.7Q229 -401 213.7 -361.8Q198.4 -322.6 198.4 -267Q198.4 -213 213.7 -173.5Q229 -134 258.1 -112.8Q287.2 -91.6 327.6 -91.6ZM877.8 12Q798.8 12 739.6 -22.4Q680.4 -56.8 647.8 -119.7Q615.2 -182.6 615.2 -267Q615.2 -352 647.8 -414.4Q680.4 -476.8 739.6 -511.4Q798.8 -546 877.8 -546Q956.8 -546 1015.7 -511.4Q1074.6 -476.8 1107.2 -414.4Q1139.8 -352 1139.8 -267Q1139.8 -182.6 1107.2 -119.7Q1074.6 -56.8 1015.7 -22.4Q956.8 12 877.8 12ZM877.8 -91.6Q939.6 -91.6 973.5 -137.9Q1007.4 -184.2 1007.4 -267Q1007.4 -349.4 973.5 -395.9Q939.6 -442.4 877.8 -442.4Q816 -442.4 781.8 -395.9Q747.6 -349.4 747.6 -267Q747.6 -184.2 781.8 -137.9Q816 -91.6 877.8 -91.6ZM1417.6 0Q1338 0 1300.5 -36.8Q1263 -73.6 1263 -152.8V-659.2H1391V-165.2Q1391 -127.6 1407.2 -113.4Q1423.4 -99.2 1456.8 -99.2H1532V0ZM1179.4 -434.8V-534H1532V-434.8ZM1714.4 0Q1655.6 0 1621 -30Q1586.4 -60 1586.4 -126.4V-710H1714.4V-139.4Q1714.4 -118.6 1724.7 -108.9Q1735 -99.2 1754.2 -99.2H1793.4V0ZM1992.6 12Q1909.4 12 1858.3 -26.4Q1807.2 -64.8 1807.2 -133.6Q1807.2 -203.2 1850.2 -242Q1893.2 -280.8 1980.6 -298L2158.2 -332.6Q2158.2 -389.6 2132.1 -418.2Q2106 -446.8 2055.4 -446.8Q2008.8 -446.8 1982.2 -425.5Q1955.6 -404.2 1946.4 -363.8L1816.2 -370.4Q1831.6 -454.6 1893.7 -500.3Q1955.8 -546 2055.4 -546Q2169.4 -546 2227.8 -488.7Q2286.2 -431.4 2286.2 -324.4V-129.8Q2286.2 -108.6 2293.5 -100.9Q2300.8 -93.2 2315.8 -93.2H2332.8V0Q2326.8 1.8 2313.4 3.1Q2300 4.4 2286.4 4.4Q2253.2 4.4 2227.3 -6.5Q2201.4 -17.4 2187 -43.5Q2172.6 -69.6 2172.6 -115.6L2184.2 -108Q2175.6 -72.8 2149.4 -45.5Q2123.2 -18.2 2083 -3.1Q2042.8 12 1992.6 12ZM2019 -81.2Q2061.6 -81.2 2092.7 -97.9Q2123.8 -114.6 2141 -144.9Q2158.2 -175.2 2158.2 -215.6V-245.6L2019.8 -217.6Q1977.4 -209.2 1958.5 -191.5Q1939.6 -173.8 1939.6 -145.6Q1939.6 -115 1960.3 -98.1Q1981 -81.2 2019 -81.2ZM2373.4 0V-534H2489.2L2494.2 -384.2L2478.6 -390.4Q2487 -446.2 2511.8 -480.3Q2536.6 -514.4 2572.9 -530.2Q2609.2 -546 2652.2 -546Q2711.2 -546 2751.5 -520.2Q2791.8 -494.4 2812.7 -448.9Q2833.6 -403.4 2833.6 -343.4V0H2705.6V-302.2Q2705.6 -347.2 2696.9 -378.3Q2688.2 -409.4 2667.8 -425.7Q2647.4 -442 2613 -442Q2561.6 -442 2531.5 -406.1Q2501.4 -370.2 2501.4 -302.2V0ZM3159.6 12Q3079.8 12 3021.1 -22.4Q2962.4 -56.8 2930.3 -119.7Q2898.2 -182.6 2898.2 -267Q2898.2 -351.4 2930.3 -413.8Q2962.4 -476.2 3020.5 -511.1Q3078.6 -546 3157.2 -546Q3233.4 -546 3290.6 -511.9Q3347.8 -477.8 3379.1 -413.8Q3410.4 -349.8 3410.4 -260V-231.4H3031Q3034.8 -160.8 3069.3 -125.6Q3103.8 -90.4 3161.2 -90.4Q3204 -90.4 3232.3 -109.5Q3260.6 -128.6 3272 -163.8L3402.8 -155.6Q3381.4 -78.2 3316.7 -33.1Q3252 12 3159.6 12ZM3031 -317.4H3277.6Q3273.6 -382.4 3240.9 -413.8Q3208.2 -445.2 3157.2 -445.2Q3105.8 -445.2 3072.3 -412.3Q3038.8 -379.4 3031 -317.4Z"
const WORD_WIDTH = 3450
const WORD_XHEIGHT = 534
const UNITS = 1000
const NODES = [[1.5, -483.5, 15], [77.5, -445.5, 13], [-362.5, -342.5, 15], [-220.5, -338.5, 13], [276.5, -317.5, 13], [440.5, -98.5, 13], [403.5, -14.5, 13], [-521.5, -108.5, 15], [-181.5, 359.5, 13]] as const
// Three arcs of the rings, spaced about a third of a turn apart, that can each carry a lane. Each runs out to its own node.
const SLOTS = [
  { arc: "M-268.0 -463.1C-260.0 -467.3 -236.5 -480.8 -220.1 -488.5C-203.7 -496.1 -187.7 -502.7 -169.8 -508.8C-151.8 -515.0 -121.8 -522.6 -112.2 -525.4", node: [-97.5, -528.5, 15], tail: [-268, -463.1] },
  { arc: "M420.2 237.1C413.3 247.3 393.5 279.7 378.8 298.2C364.2 316.8 348.9 333.0 332.2 348.5C315.6 364.0 297.6 378.5 279.0 391.5C260.3 404.4 229.9 420.4 220.1 426.2", node: [426.5, 223.5, 15], tail: [220.1, 426.2] },
  { arc: "M84.1 470.7C75.1 471.7 48.0 475.7 29.9 476.6C11.8 477.5 -6.5 477.4 -24.6 476.2C-42.7 475.1 -60.8 473.0 -78.6 469.8C-96.4 466.6 -114.2 462.5 -131.5 457.3C-148.8 452.2 -166.0 446.0 -182.6 439.0C-199.2 431.9 -215.6 423.9 -231.3 415.0C-247.0 406.2 -262.3 396.3 -276.9 385.8C-291.5 375.2 -305.6 363.7 -319.0 351.6C-332.3 339.4 -344.1 327.9 -356.9 312.8C-369.6 297.8 -389.2 269.9 -395.6 261.3", node: [-403.5, 248.5, 15], tail: [84.1, 470.7] },
] as const
const TRACE_ENDS = [[51.6, -133.1], [111.8, -77.6], [111.8, 31.2], [-43.9, 95.7], [48.2, 84.9]] as const
const TRACE_PADS = [[283.8, -99.1], [283.8, 53.5]] as const
const TICKS = Array.from({ length: 120 }, (_, i) => {
  const a = (i * Math.PI) / 60, c = Math.cos(a), s = Math.sin(a), to = R - (i % 10 === 0 ? 30 : 22), from = R - 15
  return `M${(c * from).toFixed(1)} ${(s * from).toFixed(1)}L${(c * to).toFixed(1)} ${(s * to).toFixed(1)}`
}).join("")

// Botlane's blue and the three product lanes. `live` leans toward the page's text colour, so the rings stay strong on
// white as well as on black; the disc stays dark in both
// themes, so the beams use the dark values directly.
const LANE = {
  brand: { live: "var(--brand, #4F7BFF)", solid: "#4F7BFF", lit: "#9DB5FF" },
  teal: { live: "color-mix(in srgb, var(--teal-solid, #2DD4BF), var(--neutral-12, #EDEEF0) 24%)", solid: "#2DD4BF", lit: "#99EDE1" },
  violet: { live: "color-mix(in srgb, var(--violet-solid, #8B7CFF), var(--neutral-12, #EDEEF0) 24%)", solid: "#8B7CFF", lit: "#C4BCFF" },
  orchid: { live: "color-mix(in srgb, var(--orchid-solid, #E36BD3), var(--neutral-12, #EDEEF0) 24%)", solid: "#E36BD3", lit: "#F4B9EC" },
} as const
export type SealLane = keyof typeof LANE
const THREE_LANES: readonly SealLane[] = ["teal", "violet", "orchid"]

// Beams share the edge evenly: the first head sits here, in degrees clockwise from the right, and each beam is shorter the more there are.
const BEAM_HEAD = -48, BEAM_LENGTH = { 1: 104, 2: 80, 3: 62 } as const
const EDGE = R - 2.5
const at = (deg: number) => [+(EDGE * Math.cos((deg * Math.PI) / 180)).toFixed(1), +(EDGE * Math.sin((deg * Math.PI) / 180)).toFixed(1)] as const
const beam = (index: number, count: 1 | 2 | 3) => {
  const head = BEAM_HEAD + (index * 360) / count
  const [x1, y1] = at(head - BEAM_LENGTH[count]), [x2, y2] = at(head)
  return { x1, y1, x2, y2, d: `M${x1} ${y1}A${EDGE} ${EDGE} 0 0 1 ${x2} ${y2}` }
}

const MOTION = `@keyframes seal-turn { to { transform: rotate(360deg) } }
[data-seal-beam] { transform-box: view-box; transform-origin: 0 0; animation: seal-turn 7s linear infinite }
@media (prefers-reduced-motion: reduce) { [data-seal-beam] { animation: none } }`

export type SealTone = "theme" | "white"
export type SealOptical = "tiny" | "small" | "medium" | "large"

/** Which drawing suits a disc this many pixels across: fine detail only appears where there are pixels to hold it. */
const opticalFor = (disc: number): SealOptical => (disc < 24 ? "tiny" : disc < 48 ? "small" : disc < 120 ? "medium" : "large")

/**
 * The seal. `size` is in pixels. Below 160px the rings are left off unless `rings` asks for them, because they turn to
 * dust; the disc then fills the whole size. The drawing follows the disc's real width on screen:
 *
 *   tiny    under 24px   the zigzag alone, heavy and still, on the disc
 *   small   24 to 47px   heavy circuit, no traces or ticks, and a still beam
 *   medium  48 to 119px  bolt with a hard contour, plus 1px traces
 *   large   120px up     full metal bevel, traces and the tick ring
 *
 * Hairlines use non-scaling strokes, so they stay exact device-pixel lines at any size.
 *
 * `lanes` picks the colours, one to three, in order: by default Syncc teal, Scriblane violet and Flowlane orchid. Each
 * lane lights one arc of the rings and one beam on the disc's edge, so `lanes={["teal"]}` is the seal for Syncc alone
 * and `lanes={["brand"]}` is the blue Botlane seal. The beams turn once every 7 seconds and stop under reduced motion;
 * pass `animated={false}` for a still seal. `tone="white"` is the one-colour version for dark backgrounds and photos:
 * all white, no lanes, no glass fill and no motion.
 */
export function BotlaneSeal({ size = 64, rings, animated = true, optical, lanes = THREE_LANES, tone = "theme", className, label }: { size?: number; rings?: boolean; animated?: boolean; optical?: SealOptical; lanes?: readonly SealLane[]; tone?: SealTone; className?: string; label?: string }) {
  const id = useId().replace(/:/g, "")
  const showRings = rings ?? size >= 160
  const half = showRings ? REACH : NEAT
  const px = size / (half * 2)   // pixels per unit
  const look = optical ?? opticalFor(R * 2 * px)
  const tiny = look === "tiny", small = tiny || look === "small", large = look === "large"
  const line = LINE * (tiny ? 3.4 : small ? 1.75 : large ? 1 : 1.3)
  const art = tiny ? BOLT : ICON
  const lit = (lanes.length ? lanes.slice(0, 3) : ["brand" as const]) as readonly SealLane[]
  const count = lit.length as 1 | 2 | 3
  const lift = (w: number) => Math.max(tiny ? 1.75 : 1.25, w * px)
  const white = tone === "white"
  const moving = animated && !small && !white
  const paint = (lane: SealLane) => (white ? "#fff" : LANE[lane].live)
  const ink = white ? "#fff" : "var(--neutral-12, #EDEEF0)"
  return (
    <svg
      width={size} height={size} viewBox={`${-half} ${-half} ${half * 2} ${half * 2}`} shapeRendering="geometricPrecision"
      role={label ? "img" : undefined} aria-label={label} aria-hidden={label ? undefined : true} className={cn("shrink-0", className)}
    >
      {moving && <style>{MOTION}</style>}
      <defs>
        <linearGradient id={`${id}-ring`} gradientUnits="userSpaceOnUse" x1="0" y1="-540" x2="0" y2="540">
          <stop offset="0" style={{ stopColor: ink }} />
          <stop offset="1" stopOpacity={white ? 1 : 0.62} style={{ stopColor: ink }} />
        </linearGradient>
        {lit.map((lane, i) => (
          <linearGradient key={lane} id={`${id}-arc${i}`} gradientUnits="userSpaceOnUse" x1={SLOTS[i].tail[0]} y1={SLOTS[i].tail[1]} x2={SLOTS[i].node[0]} y2={SLOTS[i].node[1]}>
            <stop offset="0" stopOpacity="0.5" style={{ stopColor: paint(lane) }} />
            <stop offset="1" style={{ stopColor: paint(lane) }} />
          </linearGradient>
        ))}
        <linearGradient id={`${id}-glass`} gradientUnits="userSpaceOnUse" x1="0" y1={-R} x2="0" y2={R}>
          <stop offset="0" stopColor="#1C1F24" />
          <stop offset="0.5" stopColor="#101114" />
          <stop offset="1" stopColor="#0B0C0E" />
        </linearGradient>
        <radialGradient id={`${id}-fall`} gradientUnits="userSpaceOnUse" cx="0" cy="0" r="1" gradientTransform={`translate(0 ${-R}) scale(${R * 1.15} ${R * 0.83})`}>
          <stop offset="0" stopColor="#4F7BFF" stopOpacity="0.3" />
          <stop offset="0.55" stopColor="#4F7BFF" stopOpacity="0.07" />
          <stop offset="1" stopColor="#4F7BFF" stopOpacity="0" />
        </radialGradient>
        <linearGradient id={`${id}-edge`} gradientUnits="userSpaceOnUse" x1="0" y1={-R} x2="0" y2={R}>
          <stop offset="0" stopColor="#fff" />
          <stop offset="0.35" stopColor="#B6BAC2" stopOpacity="0.75" />
          <stop offset="0.8" stopColor="#6C727E" stopOpacity="0.7" />
          <stop offset="1" stopColor="#C7CBD1" stopOpacity="0.9" />
        </linearGradient>
        <linearGradient id={`${id}-metal`} gradientUnits="userSpaceOnUse" x1="0" y1="-310" x2="0" y2="310">
          <stop offset="0" stopColor={large ? "#E8E9EC" : "#FCFCFD"} />
          <stop offset="0.55" stopColor={large ? "#C7CBD1" : "#E0E2E6"} />
          <stop offset="1" stopColor={large ? "#868C97" : "#AEB3BB"} />
        </linearGradient>
        {lit.map((lane, i) => {
          const b = beam(i, count)
          return (
            <linearGradient key={lane} id={`${id}-beam${i}`} gradientUnits="userSpaceOnUse" x1={b.x1} y1={b.y1} x2={b.x2} y2={b.y2}>
              <stop offset="0" stopColor={LANE[lane].solid} stopOpacity="0" />
              <stop offset="0.4" stopColor={LANE[lane].solid} />
              <stop offset="0.86" stopColor={LANE[lane].solid} />
              <stop offset="1" stopColor={LANE[lane].lit} />
            </linearGradient>
          )
        })}
        <filter id={`${id}-blur`} filterUnits="userSpaceOnUse" x={-half} y={-half} width={half * 2} height={half * 2}><feGaussianBlur stdDeviation="5" /></filter>
        <filter id={`${id}-soft`} filterUnits="userSpaceOnUse" x={-R} y={-R} width={R * 2} height={R * 2}><feGaussianBlur stdDeviation="3" /></filter>
        <clipPath id={`${id}-in`}><circle r={R - 1} /></clipPath>
        {large && (
          <mask id={`${id}-inner`} maskUnits="userSpaceOnUse" x={-R} y={-R} width={R * 2} height={R * 2}>
            <path d={art} fill="none" stroke="#fff" strokeWidth={line - 3} strokeLinecap="round" strokeLinejoin="round" />
          </mask>
        )}
      </defs>

      {showRings && (
        <g fill="none" strokeLinecap="round">
          <g stroke={`url(#${id}-ring)`}>
            <path d={RINGS} strokeWidth={Math.max(1, 4.6 * px)} vectorEffect="non-scaling-stroke" />
            {NODES.map(([cx, cy, r]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r} strokeWidth={Math.max(1, 4.6 * px)} vectorEffect="non-scaling-stroke" />)}
          </g>
          <g fill={`url(#${id}-ring)`}>{NODES.map(([cx, cy, r]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r={r * 0.36} />)}</g>
          {SLOTS.map((slot, i) => {
            const lane = white ? undefined : lit[i], [cx, cy, r] = slot.node
            const width = lane ? lift(5) : Math.max(1, 4.6 * px)
            return (
              <g key={i}>
                <path d={slot.arc} stroke={`url(#${id}-${lane ? `arc${i}` : "ring"})`} strokeWidth={width} vectorEffect="non-scaling-stroke" />
                <circle cx={cx} cy={cy} r={r} strokeWidth={width} vectorEffect="non-scaling-stroke" style={{ stroke: lane ? paint(lane) : `url(#${id}-ring)` }} />
                <circle cx={cx} cy={cy} r={lane ? 10 : r * 0.36} style={{ fill: lane ? paint(lane) : `url(#${id}-ring)` }} />
              </g>
            )
          })}
        </g>
      )}

      {!white && (
        <>
          <circle r={R} fill={`url(#${id}-glass)`} />
          <circle r={R} fill={`url(#${id}-fall)`} />
        </>
      )}
      <g clipPath={`url(#${id}-in)`} fill="none" strokeLinecap="round" strokeLinejoin="round">
        {large && !white && (
          <>
            <path d={TICKS} stroke="#fff" strokeOpacity="0.2" strokeWidth="1" strokeLinecap="butt" vectorEffect="non-scaling-stroke" />
            <circle r={R - 36} stroke="#fff" strokeOpacity="0.1" strokeWidth="1" vectorEffect="non-scaling-stroke" />
          </>
        )}
        {!small && (
          <>
            <path d={TRACES} stroke={white ? "#fff" : "#8B919C"} strokeWidth={Math.max(1, 4 * px)} vectorEffect="non-scaling-stroke" />
            <g fill={white ? "#fff" : "#8B919C"} stroke="none">
              {TRACE_ENDS.map(([cx, cy]) => <circle key={`${cx},${cy}`} cx={cx} cy={cy} r="6" />)}
              {TRACE_PADS.map(([x, y]) => <rect key={`${x},${y}`} x={x - 6} y={y - 6} width="12" height="12" rx="2" />)}
            </g>
          </>
        )}
        {!white && <path d={art} stroke="#000" strokeOpacity="0.75" strokeWidth={line} transform="translate(0 6)" filter={`url(#${id}-soft)`} />}
        {!white && <path d={art} stroke="#050607" strokeWidth={line + 5} />}
        <path d={art} stroke={white ? "#fff" : `url(#${id}-metal)`} strokeWidth={line} />
        {large && !white && (
          <g mask={`url(#${id}-inner)`}>
            <path d={art} stroke="#fff" strokeWidth={line * 0.26} strokeLinecap="butt" transform={`translate(0 ${-line * 0.2})`} />
          </g>
        )}
      </g>
      <circle r={R - 2.5} fill="none" stroke={white ? "#fff" : `url(#${id}-edge)`} strokeWidth={Math.max(1, 5 * px)} vectorEffect="non-scaling-stroke" />
      {!white && <g data-seal-beam={moving ? "" : undefined} fill="none" strokeLinecap="round">
        {lit.map((lane, i) => {
          const { d } = beam(i, count)
          return (
            <g key={lane}>
              <path d={d} stroke={LANE[lane].solid} strokeOpacity="0.8" strokeWidth="11" filter={`url(#${id}-blur)`} />
              <path d={d} stroke={`url(#${id}-beam${i})`} strokeWidth={lift(7)} vectorEffect="non-scaling-stroke" />
            </g>
          )
        })}
      </g>}
    </svg>
  )
}

/** The seal beside the wordmark, for the nav, footer and documents. `height` is the seal's size; the word follows the text colour. */
export function BotlaneLockup({ height = 32, animated = false, lanes, tone, className, label = "Botlane" }: { height?: number; animated?: boolean; lanes?: readonly SealLane[]; tone?: SealTone; className?: string; label?: string }) {
  const type = height * 0.72, width = (WORD_WIDTH / UNITS) * type, xHeight = (WORD_XHEIGHT / UNITS) * type
  return (
    <span role="img" aria-label={label} className={cn("inline-flex items-center", className)} style={{ gap: height * 0.3, color: tone === "white" ? "#fff" : undefined }}>
      <BotlaneSeal size={height} rings={false} animated={animated} lanes={lanes} tone={tone} />
      <svg width={width} height={height} viewBox={`0 0 ${WORD_WIDTH} ${(height / type) * UNITS}`} aria-hidden className="shrink-0" fill="currentColor">
        <path d={WORD} transform={`translate(0 ${((height / type) * UNITS) / 2 + (xHeight / type) * UNITS / 2})`} />
      </svg>
    </span>
  )
}
