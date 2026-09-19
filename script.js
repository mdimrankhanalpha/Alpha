/* ============================================
   Alpha — profile feed
   Post database + dynamic rendering + gallery + stopwatch
   ============================================ */

(function () {
  "use strict";

  /* ------------------------------------------------------------
     0. GitHub raw-URL conversion
     GitHub "blob" URLs cannot be used directly as <img src>.
     This converts them to raw.githubusercontent.com automatically,
     so post data can be written with normal GitHub file links.
  ------------------------------------------------------------ */
  function toRaw(url) {
    if (!url) return url;
    if (url.indexOf("raw.githubusercontent.com") !== -1) return url;
    return url
      .replace("https://github.com/", "https://raw.githubusercontent.com/")
      .replace("/blob/", "/");
  }

  var PROFILE_IMAGE =
    "https://github.com/mdimrankhanalpha/Alpha/blob/main/file_0000000012b081fa9718ddb092393a0e.png";

  /* ------------------------------------------------------------
     1. POST DATABASE
     To add a new post, add one object to this array:
       { text: "...", images: ["url1", "url2"] }
       { audio: ["url.m4a"] }      audio players (m4a, mp3, wav, ogg...)
       { video: ["url.mp4"] }      video players
       { theme: "void", text: "..." }   deep dark animated text post
     text, images, audio and video are all optional and can be
     combined in one post. Add new posts at the TOP of the list.
     Load behaviour (batch size, how far ahead to build, etc.) is
     tuned in CONFIG inside the FEED ENGINE section below.
  ------------------------------------------------------------ */
  var POSTS = [
    /* ---------- NEW POSTS (newest first) ---------- */
    /* ---------- deep dark animated post ---------- */
    {
      theme: "void",
      text: "Before I was born, there was an eternity in which I did not exist. After I die, there may be another eternity in which I do not exist. So why am I conscious specifically in this tiny moment between two infinities\u2014and why does this particular \u2018me\u2019 get to experience it at all?"
    },
    /* ---------- Sanxingdui ---------- */
    {
      text: "The animals of Sanxingdui are not drawn from life. They're invented. \n\nBirds raise their crested heads from curling branches. Other creatures pull together long jaws, horns, leaf-shaped ears, muscular bodies and spiral ornament. Every silhouette reads instantly, even when the object is broken or its original setting is lost. \n\nThese forms are often linked to sacred trees, ritual display and ancient Shu ideas about travel between realms. What they actually are, nobody can say for certain. \n\nWhat is certain: the makers were inventors. They watched the natural world, took its boldest features and stitched them into a language of movement, life and wonder. #Alpha",
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/FB_IMG_1789806405205.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/FB_IMG_1789806407556.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/FB_IMG_1789806408929.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/FB_IMG_1789806410619.jpg"
      ]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/80f34e318b785b3e1291e7ac978981db.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/3bae005d773f38d92c86a2a72381b7f1.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/d410acd9734cb0715cfa969de285ba14.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/ff977f3ce75d707710cb2e69182d8ae4%20(1).jpg"]
    },
    {
      text: "Brave theme"
    },
    {
      audio: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/New%20recording%2018%20sept%202026%209-00pm.m4a",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/23690%202026-09-18%2016-33-57.m4a"
      ]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/FB_IMG_1789676854689.jpg"]
    },
    { text: "\ud83d\ude2e\u200d\ud83d\udca8\ud83d\ude2e\u200d\ud83d\udca8\ud83d\ude2e\u200d\ud83d\udca8" },
    { text: "72\u00d7\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2\u2077\u00b2" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "\ud83d\ude21\ud83d\ude21\ud83d\ude21" },
    { text: "560 photo" },
    {
      text: "As of September 17, 2026, the most recent released chapter of Hunter \u00d7 Hunter is Chapter 420.\nLatest chapter: Chapter 420\nRelease date: September 6, 2026 on VIZ\nPrevious: Chapter 419 \u2014 August 30, 2026\nThe manga is currently continuing the Succession Contest / Black Whale storyline.\nSo if you've read through Chapter 410, there are 10 newer chapters (411\u2013420) available."
    },
    { text: "\ud83e\udd97\ud83d\udc1b" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    {
      video: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/video_20260917_124917.mp4"]
    },
    {
      text: "Meye ta valo dekhte forsha gale lal lal chupchp dag meye tar price ta anek 12:44pm. Sei dekhte ak cikshay chilo dui meeyer make cilo. Anek dam tar ami parbo na."
    },
    { text: "\ud83d\ude34\ud83d\ude34\ud83d\ude34               10:31am 17 sap 2026" },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    {
      text: "\u09b9\u09bf\u09a8\u09cd\u09a6\u09c1 \u0995\u09cb\u09a8 \u09a7\u09b0\u09cd\u09ae\u0987 \u09a8\u09be\u0964",
      video: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/1/AQO3poFBovGBB4lzNZn4z8UpZy2wQ-75pVqJPZK6N1bMUZJRNitMRscPQcH-JEezgdo9ivPhIc16JJzYOwYd3wK1LN5geqlk_Gl1PEMTOXHkiQ.mp4"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/1/216a4c05d4e89aec5e5e335ff7c7301a.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/1/289de91d23416d2ff36194490f1dbc91.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/1/47a6c55f4e196c0af3504610b1f22563.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/1/e08e6abf15025cef9e44191834556390.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/1/2f2508c61b5c74167981508e0ad9371b.jpg"]
    },
    {
      text: "\u098f\u0987 \u099a\u09be\u099a\u09be\u09df \u0993 \u0995\u09be\u09ae \u09b8\u09be\u09b0\u09b2\u09cb \u0986\u09b0 \u09a4\u09cb\u09b0\u09be \u098f\u0995\u099f\u09be \u09aa\u09cd\u09b0\u09c7\u09ae \u0993 \u0995\u09b0\u09a4\u09c7 \u09aa\u09be\u09b0\u09b2\u09bf \u09a8\u09be \u099b\u09bf\u0983 \ud83e\udd71",
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/3/%E0%A6%8F%E0%A6%87%20%E0%A6%9A%E0%A6%BE%E0%A6%9A%E0%A6%BE%E0%A6%AF%E0%A6%BC%20%E0%A6%93%20%E0%A6%95%E0%A6%BE%E0%A6%AE%20%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A6%B2%E0%A7%8B%20%E0%A6%86%E0%A6%B0%20%E0%A6%A4%E0%A7%8B%E0%A6%B0%E0%A6%BE%20%E0%A6%8F%E0%A6%95%E0%A6%9F%E0%A6%BE%20%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%AE%20%E0%A6%93%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A6%B2%E0%A6%BF%20%E0%A6%A8%E0%A6%BE%20%E0%A6%9B%E0%A6%BF%E0%A6%83%20%F0%9F%A5%B1%23foryoupage/FB_IMG_1789548677623.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/3/%E0%A6%8F%E0%A6%87%20%E0%A6%9A%E0%A6%BE%E0%A6%9A%E0%A6%BE%E0%A6%AF%E0%A6%BC%20%E0%A6%93%20%E0%A6%95%E0%A6%BE%E0%A6%AE%20%E0%A6%B8%E0%A6%BE%E0%A6%B0%E0%A6%B2%E0%A7%8B%20%E0%A6%86%E0%A6%B0%20%E0%A6%A4%E0%A7%8B%E0%A6%B0%E0%A6%BE%20%E0%A6%8F%E0%A6%95%E0%A6%9F%E0%A6%BE%20%E0%A6%AA%E0%A7%8D%E0%A6%B0%E0%A7%87%E0%A6%AE%20%E0%A6%93%20%E0%A6%95%E0%A6%B0%E0%A6%A4%E0%A7%87%20%E0%A6%AA%E0%A6%BE%E0%A6%B0%E0%A6%B2%E0%A6%BF%20%E0%A6%A8%E0%A6%BE%20%E0%A6%9B%E0%A6%BF%E0%A6%83%20%F0%9F%A5%B1%23foryoupage/FB_IMG_1789548679874.jpg"
      ]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/1/6afa1ca31738b341c617f04ea39a6c75.jpg"]
    },
    {
      text: "Ami cai na je keo amake dekhuk tar poreo dekhe. Kije dirokt Lage."
    },
    {
      text: "Biya kor but Valo income cara baccha ney ken. Kaj neoyar age biya kor. Taka hoyar por baccha ne. Kono problem na age taka joma."
    },
    { text: "12:31pm" },
    {
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/0cd20856619caeaabca4d1ffc6e1dc62.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/152a8fb70bbb6bce758e7ca806f55e61.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/1900d78db12ed568fb31b8f661291c52.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/3e7c4bff38bd937acb6cccc7a9cde42c.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/43d97bf480de7f7ea811b221ff1de932.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/45c1654ef56e004bda09696f24d6bbb9.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/6393d11dcb9c3c3f121eda5e3a848eaa.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/6fceaa463bea50edbe45ab2fbbf00dbc.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/a72479cea743574cdef64d83574ff68b.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/b520f9ac65140fe360eceb715ee5f7a7.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/bd18e9eb7c975acafd060aec4fc47607.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/d596f5dd0a901bb38257d4bb2420ff39.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/e645cc0c9011389169eba66c3b83776e.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/efbbf34d2d41520b23f214e2fe7666a1.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/fc6f1dcca3c528843332187d7870fd92.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1/ffc82a21873355a046e794c3ed8f5a53.jpg"
      ]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/09fb3828ffc7bc1746a8f9fd307fdeb5.jpg"]
    },
    { text: "\ud83d\ude34\nSeptember 16, 2026 11:03am" },
    /* ---------- END NEW POSTS ---------- */
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/c0c8dccb8029eacc0faaa33a7e7007f0.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/a2f51c97ed63212f8ed76650b1429e86.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/f4e9d09c25ac0f83f35ea39c50a6f41a.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/ee6a037124ec073c47c567b2ed38f783.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/7c39b5adb23818fb7132c751c3bfa35e.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/67b10be6d41e4f0392400617f57b53f9.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/21e00fb22a32f486729a0cd21a9af430.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/21e00fb22a32f486729a0cd21a9af430%20(1).jpg"]
    },
    {
      text: "Kichi plan moto hy na.\nBaler jibon"
    },
    {
      text: "9:14 baje akhono hy na"
    },
    {
      text: "Bal"
    },
    {
      text: "Amar o akta tap o lagbe. ki na lagbe na Amar sb lagbe."
    },
    {
      text: "AK murgi bebshai bashye o AC \n5:12"
    },
    {
      text: "23.7100285, 90.4228053",
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/Snapchat-1316998563.jpg"]
    },
    {
      text: "AJ new id banabo"
    },
    {
      text: "Ba ba ba baaaaaa ba lal tar ta to anei nai\nSei kaj hoiche.\n\nAmi nei nai ami janio na. \n\nAmar kajo chilo na ami janio na\n\nKono tao ami nai.\n\nKeo amake na cinlei Valo ami bahchi\n\nDekhi 23 tarike class,\nValo Kore porte hbe. 2026-27\n\nAkta...................\n\n\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f\n\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f\n\n3:10"
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/75ad3600c356bc95d51a1ec3f78a8aec.jpg"]
    },
    {
      text: "\u09ac\u09be\u09b8\u09be\u09df \u0986\u09b0\u0993 \u0995\u09a4\u099c\u09a8 \u0986\u099b\u09c7 \u09a4\u09be\u09a6\u09c7\u09b0\u0995\u09c7 \u09a6\u09bf\u09df\u09c7 \u09a8\u09be\u09b0\u09bf\u0995\u09c7\u09b2 \u09b8\u09c1\u09aa\u09be\u09b0\u09bf \u09a8\u09c7\u09df \u09a8\u09be\u0964 \u0986\u09ae\u09be\u0995\u09c7 \u09aa\u09be\u0987\u099b\u09c7 \u0986\u09ae\u09bf \u09ac\u09b2\u09b2\u09c7 \u09a8\u09bf\u09df\u09c7 \u0986\u09b8\u09ac\u09cb\u0964 \u0986\u09ae\u09bf \u0986\u09b0 \u09af\u09be\u09ae\u09c1 \u09a8\u09be \u09af\u09c7\u09b9\u09be\u09a8\u09c7 \u09af\u09be\u09b0 \u0995\u09be\u099c \u0995\u09b0\u09be\u09b0 \u0995\u09a5\u09be \u09b8\u09c7\u0987 \u0998\u09c1\u09ae\u09be\u09df\u0964 \u0986\u09b0 \u09ac\u09be\u0995\u09bf \u09a6\u09c1\u099c\u09a8 \u09af\u09c7 \u0986\u099b\u09c7 \u09a4\u09be\u09b0\u09be \u09a4\u09cb \u0995\u09bf\u099b\u09c1\u0987 \u09a8\u09be \u09a4\u09be\u09b0\u09be \u09a4\u09cb \u09af\u09be\u0987\u09ac\u09cb\u0993 \u09a8\u09be \u0986\u09ae\u09be\u0995\u09c7\u0987 \u09aa\u09be\u0987\u099b\u09c7 \u09af\u09be\u0993\u09df\u09be\u09b0 \u099c\u09a8\u09cd\u09af \u0986\u09ae\u09bf \u0986\u09b0 \u09af\u09be\u09ac\u0987 \u09a8\u09be\u0964 \n\u09e7:\u09ea\u09ee"
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/aaece75918921cfe835035b921ec2a1e.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/9416794f2ef991b3d421d1c00cc785ad.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/1b23759a6280501dd2b14c57b91b956a.jpg"]
    },
    {
      text: "Oops",
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/FB_IMG_1789457828692.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/FB_IMG_1789457828692.jpg"]
    },
    {
      text: "Abar Friday ami ashboi na. AMake to lare ami jamui na."
    },
    {
      text: "Ki je grm"
    },
    {
      text: "Bou ar asha na korai Valo AJ hbe ami ai taka niye Kono meye ke satisfied korte parbo na. Meye to hbei na.15 September 2026 12:20pm"
    },
    {
      text: "Meye der ja demand.\nBedhar maiyar Jamai  buyet ar engineer \n\u2639\ufe0f\nAr ami \nAmi to pamui na."
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/c864090c9626731b44106b1351d77947.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/5ca99839e726b8b4fe071fe3b428bd3e.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/Islam/39a7503d01fdfb5ba4b3b4330029a8ce.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/3/26284589a7b4bde4c29e6a2fd335eec0.jpg"]
    },
    {
      text: "My wife\u2019s house in my dream.",
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194950.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194946.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_192341.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195227.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195214.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195017.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195010.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195004.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_195000.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194956.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/My%20wife%E2%80%99s%20house%20in%20my%20dream/IMG_20260914_194953.jpg"
      ]
    },
    {
      text: "Car nite celeo jadam Abar ja tex. 15,00,000tk theke 21,00,000tk Hoye Jane. Kena inpossible 8:04"
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/2/ee21ee22e0a5e65d6c28a71749e1651c.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/2/a792c2cc3ed76049ebee70e39d3bc18d.jpg"]
    },
    {
      text: "Mone hy na ami ar fb te continue korbi. Id ban hy aro anek. Ar proton mail otar to kahini alada ja id login chi fb te ta sb lock Hoye geche Abar taka diye kintr hbe. Ar taka to Amar kace Kono kalei nai. Amar mne hy ai line tai Valo. Amar id ami nijei banai. Unique, element design, animation, unique profile, infinite profile ami nij icha nijer moto Kore bo sb Amar control a thakbe. Tai website ar banabo tao GitHub use korbo. Ar amneo Amar infinite profile to achei. 5:54"
    },
    { text: "\u2639\ufe0f\u2639\ufe0f\u2639\ufe0f" },
    { text: "54%" },
    { text: "Wifi nai \ud83e\udd15 5:36" },
    { text: "\ud83d\ude34\ud83e\udd15 5:10" },
    { text: "\ud83e\udda5" },
    { text: "5:09" },
    { text: "\ud83d\udc2f\ud83e\udd81\ud83e\udd96" },
    { text: "\u2639\ufe0f" },
    { text: "\ud83d\udd33\ud83d\udd33\ud83d\udd33\ud83d\udd33\ud83d\udd33\ud83d\udd33" },
    { text: "Rain \ud83c\udf27\ufe0f \u2614\nShe nai\nMne ki pore???\n12:16pm 14 September 2026" },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/66089b20ddc9098089b7986bfd2abfeb.jpg"]
    },
    {
      text: "\u201cEveryone has a story; let your journey speak for itself.\u201d"
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/2dbb66d8ec8df6c2fbe7a96af6018d2e.jpg"]
    },
    {
      text: "So beautiful \u2764\ufe0f",
      images: [
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/09ddd3223d3fefce3b0b089618cb617a.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/1266e2c78144850c29b5a3118c9c34ef.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/24cd7a94f5f14ec3fcf25b33b15ef138.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/3c5f0cd09bd97f5ee1f9762f03a4c159.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/76480ab1dd9297881bf658bf02a62379.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/b3738c444ea22fac91be9214e183582d.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/bd57569ce3406a14e580cc983d05b85c.jpg",
        "https://github.com/mdimrankhanalpha/Alpha/blob/main/1/cd9fa273804243383eb7a726def13381.jpg"
      ]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/90fa0d7b08629730c2b6210d51503663.jpg"]
    },
    {
      images: ["https://github.com/mdimrankhanalpha/Alpha/blob/main/f003a05f15f495d3bc56a1ecc52fd3a2.jpg"]
    },
    {
      text: "Fust Post OK",
      images: [PROFILE_IMAGE]
    }
  ];

  /* ------------------------------------------------------------
     2. FEED ENGINE  (virtualized, priority-loaded)
     ------------------------------------------------------------
     Handles very long feeds (thousands to millions of posts) on
     slow connections and low-memory phones.

     HOW IT WORKS
     - POSTS is only a list of small objects. Nothing heavy is built
       up front: the page creates one lightweight "slot" (an empty
       <article>) per loaded batch, then fills slots on demand.
     - Slots are created in batches as you scroll (infinite scroll).
     - Each slot is in one of three states:
         "live"    - near the screen: full content is built and
                     images / media are allowed to load.
         "parked"  - far from the screen: content is REMOVED from
                     the DOM (memory freed) and the slot keeps its
                     measured height so the scrollbar never jumps.
         "unbuilt" - never been near the screen yet: empty, cheap.
     - Media loads by priority. Whatever post is closest to the
       middle of the screen loads first. Audio and video load ONLY
       when the person taps play, so they cost zero data until then.
     - When a post is parked, any image / audio / video request it
       had in flight is cancelled.

     TUNING (all in one place)
  ------------------------------------------------------------ */

  var CONFIG = {
    BATCH_SIZE: 12,          // how many slots are added per infinite-scroll step
    LOOKAHEAD_BATCHES: 2,    // keep this many batches of slots ready below the viewport
    BUILD_MARGIN_PX: 900,    // build content this far above / below the screen
    PARK_MARGIN_PX: 2600,    // park (free) content beyond this distance
    MAX_LIVE_IMAGES: 3,      // images allowed to download at the same time
    ESTIMATED_HEIGHT: 320    // guess for a slot's height before it is measured
  };

  var feedEl = document.getElementById("feed");
  var sentinelEl = document.getElementById("feed-sentinel");

  var slots = [];            // { post, index, el, state, height }
  var nextToCreate = 0;      // index into POSTS of the next slot to create
  var currentlyPlaying = null;

  /* ---------- "void" post: fade in when seen ---------- */

  var voidObserver = null;
  if ("IntersectionObserver" in window) {
    voidObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add("is-visible");
          voidObserver.unobserve(entry.target);
        }
      });
    }, { threshold: 0.35 });
  }

  function buildVoidPost(text) {
    var box = document.createElement("div");
    box.className = "post-void";

    var stars = document.createElement("div");
    stars.className = "void-stars";
    stars.setAttribute("aria-hidden", "true");

    for (var s = 0; s < 46; s++) {
      var star = document.createElement("span");
      star.className = "void-star";
      var size = Math.random() < 0.85 ? 1 : 2;
      star.style.left = (Math.random() * 100) + "%";
      star.style.top = (Math.random() * 100) + "%";
      star.style.width = size + "px";
      star.style.height = size + "px";
      star.style.setProperty("--dur", (4 + Math.random() * 7).toFixed(2) + "s");
      star.style.setProperty("--delay", (Math.random() * 8).toFixed(2) + "s");
      star.style.setProperty("--peak", (0.35 + Math.random() * 0.6).toFixed(2));
      stars.appendChild(star);
    }

    var p = document.createElement("p");
    p.className = "void-text";
    p.textContent = text;

    box.appendChild(stars);
    box.appendChild(p);

    if (voidObserver) {
      voidObserver.observe(box);
    } else {
      box.classList.add("is-visible");
    }
    return box;
  }

  /* ---------- image download queue ----------
     Only MAX_LIVE_IMAGES images download at once, and the queue is
     re-sorted by distance to the middle of the screen every time a
     slot frees up, so the post you are looking at always goes first. */

  var imgQueue = [];         // { img, url, slot }
  var imgActive = 0;

  function slotDistance(slot) {
    var r = slot.el.getBoundingClientRect();
    var mid = (r.top + r.bottom) / 2;
    return Math.abs(mid - window.innerHeight / 2);
  }

  function queueImage(img, url, slot) {
    imgQueue.push({ img: img, url: url, slot: slot });
    pumpImages();
  }

  function pumpImages() {
    if (imgActive >= CONFIG.MAX_LIVE_IMAGES) reprioritise();
    while (imgActive < CONFIG.MAX_LIVE_IMAGES && imgQueue.length) {
      // drop entries whose post was parked since they were queued
      imgQueue = imgQueue.filter(function (q) {
        return q.slot.state === "live" && !q.img._parked;
      });
      if (!imgQueue.length) return;

      // pick the entry nearest to the middle of the screen
      var bestI = 0, bestD = Infinity;
      for (var i = 0; i < imgQueue.length; i++) {
        var d = slotDistance(imgQueue[i].slot);
        if (d < bestD) { bestD = d; bestI = i; }
      }
      var job = imgQueue.splice(bestI, 1)[0];
      startImage(job);
    }
  }

  var imgInFlight = [];      // jobs currently downloading

  function startImage(job) {
    var img = job.img;
    imgActive++;
    imgInFlight.push(job);
    var done = false;

    function finish() {
      if (done) return;
      done = true;
      imgActive = Math.max(0, imgActive - 1);
      var k = imgInFlight.indexOf(job);
      if (k !== -1) imgInFlight.splice(k, 1);
      pumpImages();
    }

    img.addEventListener("load", function () {
      img.classList.add("is-loaded");
      finish();
    }, { once: true });
    img.addEventListener("error", finish, { once: true });

    // lets park / cancel free this download slot without a load event
    img._release = finish;
    job.cancel = function () {
      if (done) return;
      img.removeAttribute("src");       // aborts the network request
      finish();
    };
    img.src = job.url;
  }

  // If a download is running for a post the person has scrolled far
  // away from, and something closer to the screen is waiting, cancel
  // the far one and put it back in the queue so it can retry later.
  function reprioritise() {
    if (!imgQueue.length || !imgInFlight.length) return;

    var waiting = Infinity;
    for (var i = 0; i < imgQueue.length; i++) {
      if (imgQueue[i].slot.state !== "live") continue;
      var d = slotDistance(imgQueue[i].slot);
      if (d < waiting) waiting = d;
    }
    if (waiting === Infinity) return;

    // find the farthest running download
    var farJob = null, farD = -1;
    for (var j = 0; j < imgInFlight.length; j++) {
      var dj = slotDistance(imgInFlight[j].slot);
      if (dj > farD) { farD = dj; farJob = imgInFlight[j]; }
    }
    // only swap when the waiting image is clearly closer (avoids thrash)
    if (farJob && farD > waiting + window.innerHeight) {
      var requeue = { img: farJob.img, url: farJob.url, slot: farJob.slot };
      farJob.cancel();
      imgQueue.push(requeue);
    }
  }

  /* ---------- single image ---------- */

  function buildSingleImage(url, slot, isFirstPaint) {
    var wrap = document.createElement("div");
    wrap.className = "post-image-single is-pending";

    var img = document.createElement("img");
    img.alt = "Photo";
    img.decoding = "async";
    attachFailSafe(img, wrap);
    wrap.appendChild(img);

    queueImage(img, toRaw(url), slot);
    return wrap;
  }

  /* ---------- multi-photo horizontal gallery ---------- */

  function buildGallery(urls, slot) {
    var gallery = document.createElement("div");
    gallery.className = "gallery";

    var track = document.createElement("div");
    track.className = "gallery-track";
    track.tabIndex = 0;
    track.setAttribute("role", "region");
    track.setAttribute("aria-label", "Photo gallery, " + urls.length + " photos");

    var itemEls = [];

    urls.forEach(function (url, i) {
      var item = document.createElement("div");
      item.className = "gallery-item is-pending";

      var img = document.createElement("img");
      img.alt = "Photo " + (i + 1) + " of " + urls.length;
      img.decoding = "async";
      attachFailSafe(img, item);

      item.appendChild(img);
      track.appendChild(item);
      itemEls.push(item);

      // First photo loads with the post. The rest load only when the
      // person swipes near them, so a 20-photo post costs 1 photo
      // until it is actually browsed.
      img._url = toRaw(url);
      if (i === 0) queueImage(img, img._url, slot);
    });

    var meta = document.createElement("div");
    meta.className = "gallery-meta";

    var progress = document.createElement("div");
    progress.className = "gallery-progress";
    var progressBar = document.createElement("div");
    progressBar.className = "gallery-progress-bar";
    progress.appendChild(progressBar);

    var count = document.createElement("span");
    count.className = "gallery-count";

    function loadNeighbours(idx) {
      for (var k = idx; k <= Math.min(idx + 1, itemEls.length - 1); k++) {
        var im = itemEls[k].querySelector("img");
        if (im && !im.src && im._url) queueImage(im, im._url, slot);
      }
    }

    function updateIndicator() {
      var idx = nearestItemIndex(track, itemEls);
      var total = itemEls.length;
      var left = total - (idx + 1);
      count.textContent =
        (idx + 1) + " / " + total + (left > 0 ? " \u00b7 " + left + " left" : " \u00b7 end");
      progressBar.style.width = (((idx + 1) / total) * 100) + "%";
      loadNeighbours(idx);
    }

    var ticking = false;
    track.addEventListener(
      "scroll",
      function () {
        if (ticking) return;
        ticking = true;
        requestAnimationFrame(function () {
          updateIndicator();
          ticking = false;
        });
      },
      { passive: true }
    );

    updateIndicator();

    meta.appendChild(count);
    meta.appendChild(progress);

    gallery.appendChild(track);
    gallery.appendChild(meta);
    return gallery;
  }

  function nearestItemIndex(track, itemEls) {
    var trackCenter = track.scrollLeft + track.clientWidth / 2;
    var nearest = 0;
    var nearestDist = Infinity;
    itemEls.forEach(function (item, i) {
      var itemCenter = item.offsetLeft + item.clientWidth / 2;
      var dist = Math.abs(itemCenter - trackCenter);
      if (dist < nearestDist) {
        nearestDist = dist;
        nearest = i;
      }
    });
    return nearest;
  }

  /* ---------- audio + video (tap to load) ----------
     No bytes are downloaded until the person taps play. The
     placeholder is a lightweight button. Once tapped, the real
     <audio>/<video> element is created and starts playing. */

  // Only one media element plays at a time: starting one pauses the rest.
  function registerExclusivePlayback(el) {
    el.addEventListener("play", function () {
      if (currentlyPlaying && currentlyPlaying !== el) {
        currentlyPlaying.pause();
      }
      currentlyPlaying = el;
    });
    el.addEventListener("ended", function () {
      if (currentlyPlaying === el) currentlyPlaying = null;
    });
  }

  // Fully release a media element: stop, drop the source, cancel the download.
  function releaseMedia(el) {
    try {
      el.pause();
      el.removeAttribute("src");
      var sources = el.querySelectorAll("source");
      for (var i = 0; i < sources.length; i++) sources[i].removeAttribute("src");
      el.load();
    } catch (e) { /* ignore */ }
    if (currentlyPlaying === el) currentlyPlaying = null;
  }

  // Human-readable label from a file URL, e.g. "New recording 18 sept 2026 9-00pm"
  function labelFromUrl(url, fallback) {
    try {
      var last = url.split("?")[0].split("/").pop();
      var name = decodeURIComponent(last).replace(/\.[^.]+$/, "");
      return name || fallback;
    } catch (e) {
      return fallback;
    }
  }

  function showMediaError(container, rawUrl, kind) {
    if (container.querySelector(".audio-error")) return;
    var msg = document.createElement("div");
    msg.className = "audio-error";
    msg.appendChild(document.createTextNode(kind + " could not be loaded. "));
    var link = document.createElement("a");
    link.href = rawUrl;
    link.target = "_blank";
    link.rel = "noopener";
    link.textContent = "Open file directly";
    msg.appendChild(link);
    container.appendChild(msg);
  }

  function buildPlayButton(label) {
    var btn = document.createElement("button");
    btn.type = "button";
    btn.className = "play-btn";
    btn.setAttribute("aria-label", label);
    btn.innerHTML =
      '<svg viewBox="0 0 24 24" width="20" height="20" aria-hidden="true"><path fill="currentColor" d="M8 5v14l11-7z"/></svg>';
    return btn;
  }

  function buildAudioList(urls) {
    var list = document.createElement("div");
    list.className = "audio-list";

    urls.forEach(function (url, i) {
      var raw = toRaw(url);

      var item = document.createElement("div");
      item.className = "audio-item";

      var label = document.createElement("span");
      label.className = "audio-label";
      label.textContent =
        urls.length > 1
          ? "Audio " + (i + 1) + " of " + urls.length + " \u00b7 " + labelFromUrl(url, "Recording")
          : labelFromUrl(url, "Recording");

      var holder = document.createElement("div");
      holder.className = "media-holder audio-holder";

      var btn = buildPlayButton("Load and play audio");
      var hint = document.createElement("span");
      hint.className = "play-hint";
      hint.textContent = "Tap to load audio";
      btn.appendChild(hint);

      btn.addEventListener("click", function () {
        var audio = document.createElement("audio");
        audio.controls = true;
        audio.preload = "auto";
        audio.setAttribute("controlslist", "nodownload noplaybackrate");
        audio.setAttribute("playsinline", "");

        var source = document.createElement("source");
        source.src = raw;
        source.type = mimeForAudio(raw);
        audio.appendChild(source);

        audio.addEventListener("error", function () {
          showMediaError(item, raw, "Audio");
        }, true);
        source.addEventListener("error", function () {
          showMediaError(item, raw, "Audio");
        });

        registerExclusivePlayback(audio);

        holder.innerHTML = "";
        holder.appendChild(audio);
        var pr = audio.play();
        if (pr && pr.catch) pr.catch(function () { /* user can press play */ });
      });

      holder.appendChild(btn);
      item.appendChild(label);
      item.appendChild(holder);
      list.appendChild(item);
    });

    return list;
  }

  function buildVideoList(urls) {
    var list = document.createElement("div");
    list.className = "video-list";

    urls.forEach(function (url) {
      var raw = toRaw(url);

      var wrap = document.createElement("div");
      wrap.className = "post-video";

      var holder = document.createElement("div");
      holder.className = "media-holder video-holder";

      var btn = buildPlayButton("Load and play video");
      btn.classList.add("play-btn-video");
      var hint = document.createElement("span");
      hint.className = "play-hint";
      hint.textContent = "Tap to load video";
      btn.appendChild(hint);

      btn.addEventListener("click", function () {
        var video = document.createElement("video");
        video.controls = true;
        video.preload = "auto";
        video.setAttribute("playsinline", "");
        video.setAttribute("controlslist", "nodownload");

        var source = document.createElement("source");
        source.src = raw;
        source.type = "video/mp4";
        video.appendChild(source);

        source.addEventListener("error", function () {
          showMediaError(wrap, raw, "Video");
        });

        registerExclusivePlayback(video);

        holder.innerHTML = "";
        holder.appendChild(video);
        var pr = video.play();
        if (pr && pr.catch) pr.catch(function () { /* user can press play */ });
      });

      holder.appendChild(btn);
      wrap.appendChild(holder);
      list.appendChild(wrap);
    });

    return list;
  }

  function mimeForAudio(url) {
    var ext = url.split("?")[0].split(".").pop().toLowerCase();
    var map = {
      m4a: "audio/mp4",
      mp4: "audio/mp4",
      aac: "audio/aac",
      mp3: "audio/mpeg",
      wav: "audio/wav",
      ogg: "audio/ogg",
      oga: "audio/ogg",
      opus: "audio/ogg",
      webm: "audio/webm",
      flac: "audio/flac"
    };
    return map[ext] || "";
  }

  /* ---------- broken-image safety net ---------- */

  function attachFailSafe(img, container) {
    img.addEventListener("error", function () {
      // an <img> we deliberately blanked while parking is not a failure
      if (img._parked) return;
      if (container.querySelector(".img-broken")) return;
      img.remove();
      var placeholder = document.createElement("div");
      placeholder.className = "img-broken";
      placeholder.textContent = "Image unavailable";
      container.appendChild(placeholder);
    });
  }

  /* ---------- build / park a slot ---------- */

  function buildSlotContent(slot) {
    var post = slot.post;
    var box = slot.el;

    if (post.theme === "void") {
      box.appendChild(buildVoidPost(post.text));
      return;
    }

    if (post.text) {
      var p = document.createElement("p");
      p.className = "post-text";
      p.textContent = post.text;
      box.appendChild(p);
    }

    if (post.images && post.images.length === 1) {
      box.appendChild(buildSingleImage(post.images[0], slot));
    } else if (post.images && post.images.length > 1) {
      box.appendChild(buildGallery(post.images, slot));
    }

    if (post.video && post.video.length) {
      box.appendChild(buildVideoList(post.video));
    }

    if (post.audio && post.audio.length) {
      box.appendChild(buildAudioList(post.audio));
    }
  }

  function makeLive(slot) {
    if (slot.state === "live") return;
    // Mark live BEFORE building: image jobs queued during the build
    // are only started for live slots.
    slot.state = "live";
    slot.el.style.minHeight = "";
    slot.el.classList.remove("is-parked");
    buildSlotContent(slot);
  }

  function makeParked(slot) {
    if (slot.state !== "live") return;

    // 1. remember the real height so the scrollbar does not jump
    var h = slot.el.getBoundingClientRect().height;
    if (h > 0) slot.height = h;

    // 2. cancel every in-flight download this slot owns
    var imgs = slot.el.querySelectorAll("img");
    for (var i = 0; i < imgs.length; i++) {
      imgs[i]._parked = true;
      if (imgs[i]._release) imgs[i]._release();
      imgs[i].removeAttribute("src");
    }
    var media = slot.el.querySelectorAll("audio, video");
    for (var j = 0; j < media.length; j++) releaseMedia(media[j]);

    // 3. free the DOM and hold the space
    slot.el.textContent = "";
    slot.el.style.minHeight = slot.height + "px";
    slot.el.classList.add("is-parked");
    slot.state = "parked";
  }

  /* ---------- scroll manager ----------
     One rAF-throttled pass decides, for every slot, whether it
     should be live or parked. To stay fast with huge feeds it walks
     outward from the slot nearest the viewport and stops as soon as
     it is past both margins, so cost depends on how many slots are
     near the screen, not on how many exist. */

  var ticking = false;
  var anchorIndex = 0;

  function scheduleUpdate() {
    if (ticking) return;
    ticking = true;
    requestAnimationFrame(function () {
      ticking = false;
      updateSlots();
    });
  }

  function findAnchor() {
    // start from the last known anchor and walk to the slot on screen
    var vh = window.innerHeight;
    var i = Math.min(anchorIndex, slots.length - 1);
    if (i < 0) return 0;
    var guard = 0;
    while (guard++ < slots.length) {
      var r = slots[i].el.getBoundingClientRect();
      if (r.bottom < 0 && i < slots.length - 1) i++;
      else if (r.top > vh && i > 0) i--;
      else break;
    }
    anchorIndex = i;
    return i;
  }

  function updateSlots() {
    if (!slots.length) return;
    var vh = window.innerHeight;
    var anchor = findAnchor();

    function process(i) {
      var s = slots[i];
      var r = s.el.getBoundingClientRect();
      var dist = r.bottom < 0 ? -r.bottom : (r.top > vh ? r.top - vh : 0);
      if (dist <= CONFIG.BUILD_MARGIN_PX) {
        if (s.state !== "live") makeLive(s);
        return "near";
      }
      if (dist > CONFIG.PARK_MARGIN_PX) {
        if (s.state === "live") makeParked(s);
        return "far";
      }
      return "mid";   // between margins: leave it exactly as it is
    }

    // walk down from the anchor, then up
    var i, res;
    for (i = anchor; i < slots.length; i++) {
      res = process(i);
      if (res === "far" && i > anchor) {
        // everything after this is even farther; make sure they are parked
        for (var k = i + 1; k < slots.length && slots[k].state === "live"; k++) makeParked(slots[k]);
        break;
      }
    }
    for (i = anchor - 1; i >= 0; i--) {
      res = process(i);
      if (res === "far") {
        for (var m = i - 1; m >= 0 && slots[m].state === "live"; m--) makeParked(slots[m]);
        break;
      }
    }

    pumpImages();
    ensureLookahead();
  }

  /* ---------- infinite scroll: create slots in batches ---------- */

  function createBatch() {
    if (nextToCreate >= POSTS.length) return false;
    var end = Math.min(nextToCreate + CONFIG.BATCH_SIZE, POSTS.length);
    var frag = document.createDocumentFragment();

    for (; nextToCreate < end; nextToCreate++) {
      var post = POSTS[nextToCreate];
      var el = document.createElement("article");
      el.className = "post is-parked";
      el.style.minHeight = CONFIG.ESTIMATED_HEIGHT + "px";
      slots.push({
        post: post,
        index: nextToCreate,
        el: el,
        state: "unbuilt",
        height: CONFIG.ESTIMATED_HEIGHT
      });
      frag.appendChild(el);
    }
    feedEl.appendChild(frag);

    if (nextToCreate >= POSTS.length) {
      feedEl.classList.add("feed-complete");
      if (feedObserver) feedObserver.disconnect();
    }
    return true;
  }

  // Keep enough empty slots below the screen that scrolling never
  // hits the bottom before the next batch exists.
  function ensureLookahead() {
    var want = CONFIG.BATCH_SIZE * CONFIG.LOOKAHEAD_BATCHES;
    var guard = 0;
    while (nextToCreate < POSTS.length && guard++ < 20) {
      var lastIdx = slots.length - 1;
      var slotsBelow = 0;
      if (lastIdx >= 0) {
        slotsBelow = lastIdx - anchorIndex;
      }
      if (slotsBelow >= want) break;
      createBatch();
      // new slots are appended below, so anchor stays valid
    }
  }

  var feedObserver = null;
  if ("IntersectionObserver" in window && sentinelEl) {
    feedObserver = new IntersectionObserver(function (entries) {
      if (entries[0].isIntersecting) {
        ensureLookahead();
        scheduleUpdate();
      }
    }, { rootMargin: "1600px 0px" });
    feedObserver.observe(sentinelEl);
  }

  window.addEventListener("scroll", scheduleUpdate, { passive: true });
  window.addEventListener("resize", scheduleUpdate, { passive: true });
  // pausing tab / returning to tab: re-evaluate
  document.addEventListener("visibilitychange", scheduleUpdate);

  // Initial render: first batches, then fill what is on screen.
  createBatch();
  createBatch();
  updateSlots();

  // Tiny public hook so new posts can be added at runtime, e.g. from
  // a fetch() call:  window.AlphaFeed.append([{ text: "hi" }])
  window.AlphaFeed = {
    append: function (newPosts) {
      if (!newPosts || !newPosts.length) return;
      for (var i = 0; i < newPosts.length; i++) POSTS.push(newPosts[i]);
      if (feedObserver && sentinelEl) feedObserver.observe(sentinelEl);
      feedEl.classList.remove("feed-complete");
      ensureLookahead();
      scheduleUpdate();
    },
    count: function () { return POSTS.length; },
    liveCount: function () {
      return slots.filter(function (s) { return s.state === "live"; }).length;
    }
  };

  /* ------------------------------------------------------------
     3. PROFILE AVATAR
  ------------------------------------------------------------ */
  var avatar = document.getElementById("avatar");
  avatar.src = toRaw(PROFILE_IMAGE);
  attachFailSafe(avatar, avatar.parentElement);

  /* ------------------------------------------------------------
     4. STOPWATCH
     Fixed start: 14 September 2026, 00:00:00 Bangladesh time (UTC+06:00).
     Elapsed time is always derived from (now - start), never stored,
     so it survives refreshes and cannot drift or reset.
  ------------------------------------------------------------ */
  var START_MS = Date.UTC(2026, 8, 13, 18, 0, 0); // 2026-09-14T00:00:00+06:00

  var stopwatchEl = document.getElementById("stopwatch");

  function pad(n) {
    return String(n).length < 2 ? "0" + n : String(n);
  }

  function tickStopwatch() {
    var elapsed = Date.now() - START_MS;
    if (elapsed < 0) elapsed = 0;

    var totalSeconds = Math.floor(elapsed / 1000);
    var days = Math.floor(totalSeconds / 86400);
    var hours = Math.floor((totalSeconds % 86400) / 3600);
    var minutes = Math.floor((totalSeconds % 3600) / 60);
    var seconds = totalSeconds % 60;

    stopwatchEl.textContent =
      pad(days) + "d " + pad(hours) + "h " + pad(minutes) + "m " + pad(seconds) + "s";
  }

  tickStopwatch();
  setInterval(tickStopwatch, 1000);
})();
