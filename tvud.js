  function ChangeListNgay(tngay) {

    var listngay = document.getElementById('ID_SELNGAYDUONG');


    var len = listngay.options.length;
    var newngay = len;
    if (len < tngay) {
      for (i = 1; i <= (tngay - len); i++) {
        newngay++;
        var temp = newngay.toString();
        var optnew = document.createElement('option');
        optnew.value = temp;
        optnew.text = temp;
        try {
          listngay.add(optnew, null);
        } catch (e) {
          listngay.add(optnew);
        }
      }
    } else if (len > tngay) {
      for (i = 1; i <= (len - tngay); i++) {
        listngay.remove(listngay.length - 1);
      }
    }
  }


  function ChangeNgay() {

    var listthang = document.getElementById('ID_SELTHANGDUONG');
    var listnam = document.getElementById('ID_SELNAMDUONG');

    var nam;
    var thang;
    var lennam = listnam.options.length;
    var lenthang = listthang.options.length;
    for (i = 0; i < lennam; i++) {
      if (listnam.options[i].selected)
        nam = parseInt(listnam.options[i].value);
    }

    for (i = 0; i < lenthang; i++) {
      if (listthang.options[i].selected)
        thang = parseInt(listthang.options[i].value);
    }

    var ngay;
    if (thang == 1 || thang == 3 || thang == 5 || thang == 7 || thang == 8 || thang == 10 || thang == 12)
      ngay = 31;
    else if (thang == 2) {
      if (nam % 4 == 0) {
        ngay = 29;
      } else ngay = 28;
    } else ngay = 30;
    ChangeListNgay(ngay);

  }

  var background = new(function() {
    var tmp = this;
    tmp.image = new Image();
    var w = canvas.width / 4;
    var h = canvas.height / 4;
    tmp.width = w * 2;
    tmp.height = h * 2;
    tmp.image.src = "tvudback.gif";
    tmp.draw = function() {
      try {
        context.drawImage(tmp.image, w, h, tmp.width, tmp.height);
      } catch (e) {};
    }
  });

  /*
   * Copyright (c) 2006 Ho Ngoc Duc. All Rights Reserved.
   * Astronomical algorithms from the book "Astronomical Algorithms" by Jean Meeus, 1998
   *
   * Permission to use, copy, modify, and redistribute this software and its
   * documentation for personal, non-commercial use is hereby granted provided that
   * this copyright notice and appropriate documentation appears in all copies.
   */
  var PI = Math.PI;

  /* Discard the fractional part of a number, e.g., INT(3.2) = 3 */
  function INT(d) {
    return Math.floor(d);
  }

  /* Compute the (integral) Julian day number of day dd/mm/yyyy, i.e., the number
   * of days between 1/1/4713 BC (Julian calendar) and dd/mm/yyyy.
   * Formula from http://www.tondering.dk/claus/calendar.html
   */
  function jdFromDate(dd, mm, yy) {
    var a, y, m, jd;
    a = INT((14 - mm) / 12);
    y = yy + 4800 - a;
    m = mm + 12 * a - 3;
    jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - INT(y / 100) + INT(y / 400) - 32045;
    if (jd < 2299161) {
      jd = dd + INT((153 * m + 2) / 5) + 365 * y + INT(y / 4) - 32083;
    }
    return jd;
  }

  /* Convert a Julian day number to day/month/year. Parameter jd is an integer */
  function jdToDate(jd) {
    var a, b, c, d, e, m, day, month, year;
    if (jd > 2299160) { // After 5/10/1582, Gregorian calendar
      a = jd + 32044;
      b = INT((4 * a + 3) / 146097);
      c = a - INT((b * 146097) / 4);
    } else {
      b = 0;
      c = jd + 32082;
    }
    d = INT((4 * c + 3) / 1461);
    e = c - INT((1461 * d) / 4);
    m = INT((5 * e + 2) / 153);
    day = e - INT((153 * m + 2) / 5) + 1;
    month = m + 3 - 12 * INT(m / 10);
    year = b * 100 + d - 4800 + INT(m / 10);
    return new Array(day, month, year);
  }

  /* Compute the time of the k-th new moon after the new moon of 1/1/1900 13:52 UCT
   * (measured as the number of days since 1/1/4713 BC noon UCT, e.g., 2451545.125 is 1/1/2000 15:00 UTC).
   * Returns a floating number, e.g., 2415079.9758617813 for k=2 or 2414961.935157746 for k=-2
   * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
   */
  function NewMoon(k) {
    var T, T2, T3, dr, Jd1, M, Mpr, F, C1, deltat, JdNew;
    T = k / 1236.85; // Time in Julian centuries from 1900 January 0.5
    T2 = T * T;
    T3 = T2 * T;
    dr = PI / 180;
    Jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3;
    Jd1 = Jd1 + 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * dr); // Mean new moon
    M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3; // Sun's mean anomaly
    Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3; // Moon's mean anomaly
    F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3; // Moon's argument of latitude
    C1 = (0.1734 - 0.000393 * T) * Math.sin(M * dr) + 0.0021 * Math.sin(2 * dr * M);
    C1 = C1 - 0.4068 * Math.sin(Mpr * dr) + 0.0161 * Math.sin(dr * 2 * Mpr);
    C1 = C1 - 0.0004 * Math.sin(dr * 3 * Mpr);
    C1 = C1 + 0.0104 * Math.sin(dr * 2 * F) - 0.0051 * Math.sin(dr * (M + Mpr));
    C1 = C1 - 0.0074 * Math.sin(dr * (M - Mpr)) + 0.0004 * Math.sin(dr * (2 * F + M));
    C1 = C1 - 0.0004 * Math.sin(dr * (2 * F - M)) - 0.0006 * Math.sin(dr * (2 * F + Mpr));
    C1 = C1 + 0.0010 * Math.sin(dr * (2 * F - Mpr)) + 0.0005 * Math.sin(dr * (2 * Mpr + M));
    if (T < -11) {
      deltat = 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3;
    } else {
      deltat = -0.000278 + 0.000265 * T + 0.000262 * T2;
    };
    JdNew = Jd1 + C1 - deltat;
    return JdNew;
  }

  /* Compute the longitude of the sun at any time.
   * Parameter: floating number jdn, the number of days since 1/1/4713 BC noon
   * Algorithm from: "Astronomical Algorithms" by Jean Meeus, 1998
   */
  function SunLongitude(jdn) {
    var T, T2, dr, M, L0, DL, L;
    T = (jdn - 2451545.0) / 36525; // Time in Julian centuries from 2000-01-01 12:00:00 GMT
    T2 = T * T;
    dr = PI / 180; // degree to radian
    M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2; // mean anomaly, degree
    L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2; // mean longitude, degree
    DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(dr * M);
    DL = DL + (0.019993 - 0.000101 * T) * Math.sin(dr * 2 * M) + 0.000290 * Math.sin(dr * 3 * M);
    L = L0 + DL; // true longitude, degree
    L = L * dr;
    L = L - PI * 2 * (INT(L / (PI * 2))); // Normalize to (0, 2*PI)
    return L;
  }

  /* Compute sun position at midnight of the day with the given Julian day number.
   * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00.
   * The function returns a number between 0 and 11.
   * From the day after March equinox and the 1st major term after March equinox, 0 is returned.
   * After that, return 1, 2, 3 ...
   */
  function getSunLongitude(dayNumber, timeZone) {
    return INT(SunLongitude(dayNumber - 0.5 - timeZone / 24) / PI * 6);
  }

  /* Compute the day of the k-th new moon in the given time zone.
   * The time zone if the time difference between local time and UTC: 7.0 for UTC+7:00
   */
  function getNewMoonDay(k, timeZone) {
    return INT(NewMoon(k) + 0.5 + timeZone / 24);
  }

  /* Find the day that starts the luner month 11 of the given year for the given time zone */
  function getLunarMonth11(yy, timeZone) {
    var k, off, nm, sunLong;
    //off = jdFromDate(31, 12, yy) - 2415021.076998695;
    off = jdFromDate(31, 12, yy) - 2415021;
    k = INT(off / 29.530588853);
    nm = getNewMoonDay(k, timeZone);
    sunLong = getSunLongitude(nm, timeZone); // sun longitude at local midnight
    if (sunLong >= 9) {
      nm = getNewMoonDay(k - 1, timeZone);
    }
    return nm;
  }

  /* Find the index of the leap month after the month starting on the day a11. */
  function getLeapMonthOffset(a11, timeZone) {
    var k, last, arc, i;
    k = INT((a11 - 2415021.076998695) / 29.530588853 + 0.5);
    last = 0;
    i = 1; // We start with the month following lunar month 11
    arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    do {
      last = arc;
      i++;
      arc = getSunLongitude(getNewMoonDay(k + i, timeZone), timeZone);
    } while (arc != last && i < 14);
    return i - 1;
  }

  /* Comvert solar date dd/mm/yyyy to the corresponding lunar date */
  function convertSolar2Lunar(dd, mm, yy, timeZone) {
    var k, dayNumber, monthStart, a11, b11, lunarDay, lunarMonth, lunarYear, lunarLeap;
    dayNumber = jdFromDate(dd, mm, yy);
    k = INT((dayNumber - 2415021.076998695) / 29.530588853);
    monthStart = getNewMoonDay(k + 1, timeZone);
    if (monthStart > dayNumber) {
      monthStart = getNewMoonDay(k, timeZone);
    }
    //alert(dayNumber+" -> "+monthStart);
    a11 = getLunarMonth11(yy, timeZone);
    b11 = a11;
    if (a11 >= monthStart) {
      lunarYear = yy;
      a11 = getLunarMonth11(yy - 1, timeZone);
    } else {
      lunarYear = yy + 1;
      b11 = getLunarMonth11(yy + 1, timeZone);
    }
    lunarDay = dayNumber - monthStart + 1;
    diff = INT((monthStart - a11) / 29);
    lunarLeap = 0;
    lunarMonth = diff + 11;
    if (b11 - a11 > 365) {
      leapMonthDiff = getLeapMonthOffset(a11, timeZone);
      if (diff >= leapMonthDiff) {
        lunarMonth = diff + 10;
        if (diff == leapMonthDiff) {
          lunarLeap = 1;
        }
      }
    }
    if (lunarMonth > 12) {
      lunarMonth = lunarMonth - 12;
    }
    if (lunarMonth >= 11 && diff < 4) {
      lunarYear -= 1;
    }
    return new Array(lunarDay, lunarMonth, lunarYear, lunarLeap);
  }

  /* Convert a lunar date to the corresponding solar date */
  function convertLunar2Solar(lunarDay, lunarMonth, lunarYear, lunarLeap, timeZone) {
    var k, a11, b11, off, leapOff, leapMonth, monthStart;
    if (lunarMonth < 11) {
      a11 = getLunarMonth11(lunarYear - 1, timeZone);
      b11 = getLunarMonth11(lunarYear, timeZone);
    } else {
      a11 = getLunarMonth11(lunarYear, timeZone);
      b11 = getLunarMonth11(lunarYear + 1, timeZone);
    }
    k = INT(0.5 + (a11 - 2415021.076998695) / 29.530588853);
    off = lunarMonth - 11;
    if (off < 0) {
      off += 12;
    }
    if (b11 - a11 > 365) {
      leapOff = getLeapMonthOffset(a11, timeZone);
      leapMonth = leapOff - 2;
      if (leapMonth < 0) {
        leapMonth += 12;
      }
      if (lunarLeap != 0 && lunarMonth != leapMonth) {
        return new Array(0, 0, 0);
      } else if (lunarLeap != 0 || off >= leapOff) {
        off += 1;
      }
    }
    monthStart = getNewMoonDay(k + off, timeZone);
    return jdToDate(monthStart + lunarDay - 1);
  }

  function fix12(n) {
    while (n > 12) {
      n = n - 12;
    }
    while (n <= 0) {
      n = n + 12;
    }
    return n;
  }

  function fix10(n) {
    while (n > 10) {
      n = n - 10;
    }
    while (n <= 0) {
      n = n + 10;
    }
    return n;
  }

  function textUnderline(ctx, text, x, y, color, textSize, align) {

    //Get the width of the text
    var textWidth = ctx.measureText(text).width;

    //var to store the starting position of text (X-axis)
    var startX;

    //var to store the starting position of text (Y-axis)
    // I have tried to set the position of the underline according
    // to size of text. You can change as per your need
    var startY = y + (parseInt(textSize) / 15);

    //var to store the end position of text (X-axis)
    var endX;

    //var to store the end position of text (Y-axis)
    //It should be the same as start position vertically.
    var endY = startY;

    //To set the size line which is to be drawn as underline.
    //Its set as per the size of the text. Feel free to change as per need.
    var underlineHeight = parseInt(textSize) / 15;

    //Because of the above calculation we might get the value less
    //than 1 and then the underline will not be rendered. this is to make sure
    //there is some value for line width.
    if (underlineHeight < 1) {
      underlineHeight = 1;
    }

    ctx.beginPath();
    if (align == "center") {
      startX = x - (textWidth / 2);
      endX = x + (textWidth / 2);
    } else if (align == "right") {
      startX = x - textWidth;
      endX = x;
    } else {
      startX = x;
      endX = x + textWidth;
    }

    ctx.strokeStyle = color;
    ctx.lineWidth = underlineHeight;
    ctx.moveTo(startX, startY + 0.5);
    ctx.lineTo(endX, endY + 0.5);
    ctx.stroke();
  }

  function main() {

    // document.getElementById('canvasImg').style.display = 'block';
    function printw(chu, mauchu, vx, vy) {
      context.fillStyle = mauchu;
      context.fillText(chu, vx, vy);
    }

    var duonglich;
    var ngayduong;
    var thangduong;
    var namduong;
    var gioduong;
    var phutduong;

    var amlich;
    var ngay;
    var thang;
    var canmam;
    var chinam;
    var gio;
    var dl = new Array();
    var thangnhuan = 0;
    var namduong2;

    var namxem;
    for (i = 0; i < document.getElementById('ID_SELNAMXEM').length; i++) {
      if (document.getElementById('ID_SELNAMXEM').options[i].selected)
        namxem = parseInt(document.getElementById('ID_SELNAMXEM').options[i].value);
    }

    if (document.getElementById('ID_THANGNHUAN').checked)
      thangnhuan = 1;

    duonglich = 1;
    amlich = 0;

    var ten = document.getElementById('ID_TEN').value;

    if (!document.getElementById('ID_AMLICH').checked) {
      duonglich = 1;
      amlich = 0;
    } else {
      amlich = 1;
      duonglich = 0;
    }

    //Lấy giới tính (nam: 1, nữ: 0)
    var list = document.getElementById('ID_GIOITINH');
    for (var i = 0; i < list.options.length; ++i) {
      if (list.options[i].selected)
        gioitinh = parseInt(list.options[i].value);
    }

    //lấy thông tin ngày tháng năm giờ sinh âm lịch
    if (amlich == 1) {
      list = document.getElementById('ID_CANNAM');
      for (var i = 0; i < list.options.length; ++i) {
        if (list.options[i].selected)
          cannam = parseInt(list.options[i].value);
      }
      list = document.getElementById('ID_CHINAM');
      for (var i = 0; i < list.options.length; ++i) {
        if (list.options[i].selected)
          chinam = parseInt(list.options[i].value);
      }
      list = document.getElementById('ID_GIO');
      for (var i = 0; i < list.options.length; ++i) {
        if (list.options[i].selected)
          gio = parseInt(list.options[i].value);
      }
      ngay = parseInt(document.getElementById('ID_NGAY').value);
      thang = parseInt(document.getElementById('ID_THANG').value);
      namduong2 = parseInt(document.getElementById('ID_NAMDUONG2').value);
      if (cannam != fix10(namduong2 % 10 + 7) || chinam != fix12(namduong2 % 12 + 9)) {
        alert("Năm Dương Lịch không chính xác. Xin vui lòng nhập lại!");
        return;
      }
      var listtemp = new Array();
      listtemp = convertLunar2Solar(ngay, thang, namduong2, thangnhuan, 7.0)
      ngayduong = listtemp[0];
      thangduong = listtemp[1];
      namduong = listtemp[2];

    }
    //lấy thông tin ngày sinh theo giờ dương
    else if (duonglich == 1) {
      //ngayduong = parseInt(document.getElementById('ID_TXTNGAYDUONG').value);
      for (i = 0; i < document.getElementById('ID_SELNGAYDUONG').length; i++) {
        if (document.getElementById('ID_SELNGAYDUONG').options[i].selected)
          ngayduong = parseInt(document.getElementById('ID_SELNGAYDUONG').options[i].value);
      }
      //thangduong = parseInt(document.getElementById('ID_TXTTHANGDUONG').value);
      for (i = 0; i < document.getElementById('ID_SELTHANGDUONG').length; i++) {
        if (document.getElementById('ID_SELTHANGDUONG').options[i].selected)
          thangduong = parseInt(document.getElementById('ID_SELTHANGDUONG').options[i].value);
      }
      //namduong = parseInt(document.getElementById('ID_TXTNAMDUONG').value);
      for (i = 0; i < document.getElementById('ID_SELNAMDUONG').length; i++) {
        if (document.getElementById('ID_SELNAMDUONG').options[i].selected)
          namduong = parseInt(document.getElementById('ID_SELNAMDUONG').options[i].value);
      }
      //gioduong = parseInt(document.getElementById('ID_TXTGIODUONG').value);
      for (i = 0; i < document.getElementById('ID_SELGIODUONG').length; i++) {
        if (document.getElementById('ID_SELGIODUONG').options[i].selected)
          gioduong = parseInt(document.getElementById('ID_SELGIODUONG').options[i].value);
      }
      //phutduong = parseInt(document.getElementById('ID_PHUTDUONG').value);
      dl = convertSolar2Lunar(ngayduong, thangduong, namduong, 7.0);

      ngay = dl[0];
      thang = dl[1];
      var candoi = dl[2] % 10;
      var chidoi = dl[2] % 12;

      candoi = (candoi + 7)
      if (candoi > 10) candoi = candoi - 10;
      cannam = candoi;

      chidoi = chidoi + 9;
      if (chidoi > 12) chidoi = chidoi - 12;
      chinam = chidoi;

      //gioduong = gioduong + phutduong / 60;

      var ktti = 1;

      gio = gioduong;

      thangnhuan = dl[3];
    }

    var can = new Array();
    var chi = new Array();

    can[1] = "Giáp";
    can[2] = "Ất";
    can[3] = "Bính";
    can[4] = "Đinh";
    can[5] = "Mậu";
    can[6] = "Kỷ";
    can[7] = "Canh";
    can[8] = "Tân";
    can[9] = "Nhâm";
    can[10] = "Quý";


    chi[1] = "Tý";
    chi[2] = "Sửu";
    chi[3] = "Dần";
    chi[4] = "Mão";
    chi[5] = "Thìn";
    chi[6] = "Tị";
    chi[7] = "Ngọ";
    chi[8] = "Mùi";
    chi[9] = "Thân";
    chi[10] = "Dậu";
    chi[11] = "Tuất";
    chi[12] = "Hợi";

    //tính can chi ngày tháng năm

    var canthang = fix10((cannam * 2 + 1) % 10 + (thang - 1));
    var chithang = fix12(thang + 2);


    var a = ((14 - thangduong) - (14 - thangduong) % 12) / 12
    var y = namduong + 4800 - a
    var m = thangduong + 12 * a - 3

    //Lịch Gregory:

    var jd = ngayduong + ((153 * m + 2) - ((153 * m + 2) % 5)) / 5 + 365 * y + (y - (y % 4)) / 4 - (y - y % 100) / 100 + (y - (y % 400)) / 400 - 32045;

    var canngay = fix10((jd + 9) % 10 + 1);
    var chingay = fix12((jd + 1) % 12 + 1);

    var cangio = fix10(fix10((canngay * 2) - 1) + gio - 1);
    var chigio = gio;

    //tính cung mệnh cung thân
    var cungmenh = fix12(thang - gio + 1);
    var cungthan = fix12(gio + thang - 1);


    // draw
    var h = canvas.height / 4;
    var w = canvas.width / 4;
    var iheight = h * 4;
    var iwidth = w * 4;
    var xcung = new Array();
    var ycung = new Array();

    xcung[1] = 0;
    xcung[2] = 0;
    xcung[3] = 0;
    xcung[4] = 0;
    xcung[5] = w;
    xcung[6] = w * 2;
    xcung[7] = w * 3;
    xcung[8] = w * 3;
    xcung[9] = w * 3;
    xcung[10] = w * 3;
    xcung[11] = w * 2;
    xcung[12] = w;

    ycung[1] = 3 * h;
    ycung[2] = 2 * h;
    ycung[3] = h;
    ycung[4] = 0;
    ycung[5] = 0;
    ycung[6] = 0;
    ycung[7] = 0;
    ycung[8] = h;
    ycung[9] = h * 2;
    ycung[10] = h * 3;
    ycung[11] = h * 3;
    ycung[12] = h * 3;

    var xpoint = new Array();
    xpoint[1] = xcung[1] + w;
    xpoint[2] = xcung[1] + w;
    xpoint[3] = xcung[1] + w;
    xpoint[4] = xcung[1] + w;
    xpoint[5] = xcung[5] + w / 2;
    xpoint[6] = xcung[6] + w / 2;
    xpoint[7] = xcung[7];
    xpoint[8] = xcung[7];
    xpoint[9] = xcung[7];
    xpoint[10] = xcung[7];
    xpoint[11] = xcung[11] + w / 2;
    xpoint[12] = xcung[12] + w / 2;

    var ypoint = new Array();
    ypoint[1] = ycung[1];
    ypoint[2] = ycung[2] + h / 2;
    ypoint[3] = ycung[3] + h / 2;
    ypoint[4] = ycung[4] + h;
    ypoint[5] = ycung[5] + h;
    ypoint[6] = ycung[6] + h;
    ypoint[7] = ycung[7] + h;
    ypoint[8] = ycung[8] + h / 2;
    ypoint[9] = ycung[9] + h / 2;
    ypoint[10] = ycung[10];
    ypoint[11] = ycung[11];
    ypoint[12] = ycung[12];

    var cungdi = fix12(cungmenh + 6);
    var cungquan = fix12(cungmenh + 4);
    var cungtai = fix12(cungmenh - 4);


    context.beginPath();
    context.clearRect(0, 0, w * 4, h * 4);


    //	var img = new Image();
    //	img.width = w*2;
    //	img.height = h*2;
    //	img.src = 'tvudback.gif';
    //context.drawImage(base_image,w,h, base_image.width, base_image.height);
    //	context.drawImage(img,w,h, w*2, h*2);
    background.draw();

    context.beginPath();
    context.moveTo(xpoint[cungmenh], ypoint[cungmenh]);
    context.lineTo(xpoint[cungdi], ypoint[cungdi]);
    context.moveTo(xpoint[cungmenh], ypoint[cungmenh]);
    context.lineTo(xpoint[cungquan], ypoint[cungquan]);
    context.moveTo(xpoint[cungmenh], ypoint[cungmenh]);
    context.lineTo(xpoint[cungtai], ypoint[cungtai]);
    context.strokeStyle = '#DCDCDC';
    context.stroke();

    context.beginPath();
    for (i = 0; i < 4; i++) {
      context.rect(w * i, 0, w, h);
      context.rect(w * i + 0.5, 0.5, w - 0.5, h - 1);
      if (i > 0) {
        context.rect(0, h * i, w, h);
        context.rect(0.5, h * i + 0.5, w - 1, h - 0.5);

        context.rect(w * i, h * 3, w, h);
        context.rect(w * i + 0.5, h * 3 + 0.5, w - 0.5, h + 0.5);


        context.rect(w * 3, h * i, w, h);
        context.rect(w * 3 + 0.5, h * i + 0.5, w + 0.5, h - 0.5);
      }
    }

    context.fillStyle = 'white';
    context.fill();
    context.strokeStyle = '#000000';
    context.stroke();

    context.beginPath();
    context.rect(1, 1, w * 4 - 2, h * 4 - 2);
    context.rect(2, 2, w * 4 - 4, h * 4 - 4);
    context.strokeStyle = '#000000';
    context.stroke();



    context.font = 'bold 14pt Verdana';
    context.textAlign = 'center';
    context.fillStyle = 'red';

    var x = w + w / 2 - 25;
    var y = h + h / 2 - 30;

    context.fillText("Tử Vi Ứng Dụng Bửu Đình", w * 2, h * 3 - 60);

    context.font = "bold 10pt Arial";
    context.fillStyle = 'blue';
    context.fillText("Email: maihoa.space@gmail.com", w * 2, h * 3 - 44);
    context.fillStyle = 'black';
    context.fillText("(Lá số an theo Tử Vi Ứng Dụng)", w * 2, h * 3 - 28);

    context.font = 'bold 9.5pt Arial';
    context.textAlign = 'center';
    //    context.fillStyle = 'black';
    //	context.fillText("Họ Tên:", x, y + 16);
    context.fillStyle = '#353580';
    context.fillText(ten, w * 2, y + 5);

    context.font = 'bold 9.5pt Arial';
    context.textAlign = 'left';
    var amduong;
    if (cannam % 2 == 0)
      amduong = "Âm";
    else
      amduong = "Dương";
    if (gioitinh == 1)
      amduong = amduong + " Nam";
    else
      amduong = amduong + " Nữ";

    context.fillStyle = 'black';
    context.fillText("Năm:", x, y + 30);
    context.fillStyle = '#353580';
    context.fillText(namduong, x + 80, y + 30);
    context.fillText(can[cannam] + " " + chi[chinam], x + 130, y + 30);

    context.fillStyle = 'black';
    context.fillText("Ngày:", x, y + 46);
    context.fillStyle = '#353580';
    context.fillText(ngayduong + " (" + ngay + ")", x + 80, y + 46);
    context.fillText(can[canngay] + " " + chi[chingay], x + 130, y + 46);

    context.fillStyle = 'black';
    context.fillText("Tháng:", x, y + 62);
    context.fillStyle = '#353580';
    var texttemp = "";
    if (thangnhuan == 1)
      texttemp = " n";
    context.fillText(thangduong + " (" + thang + texttemp + ")", x + 80, y + 62);
    context.fillText(can[canthang] + " " + chi[chithang], x + 130, y + 62);

    context.fillStyle = 'black';
    context.fillText("Giờ:", x, y + 78);
    context.fillStyle = '#353580';
    context.fillText(can[cangio] + " " + chi[chigio], x + 130, y + 78);

    var napammenh;

    if ((cannam == 1 && chinam == 1) || (cannam == 2 && chinam == 2))
      napammenh = "Hải Trung Kim";
    else if ((cannam == 3 && chinam == 3) || (cannam == 4 && chinam == 4))
      napammenh = "Lô Trung Hỏa";
    else if ((cannam == 5 && chinam == 5) || (cannam == 6 && chinam == 6))
      napammenh = "Đại Lâm Mộc";
    else if ((cannam == 7 && chinam == 7) || (cannam == 8 && chinam == 8))
      napammenh = "Lộ Bàng Thổ";
    else if ((cannam == 9 && chinam == 9) || (cannam == 10 && chinam == 10))
      napammenh = "Kiếm Phong Kim";
    else if ((cannam == 1 && chinam == 11) || (cannam == 2 && chinam == 12))
      napammenh = "Sơn Đầu Hỏa";
    else if ((cannam == 3 && chinam == 1) || (cannam == 4 && chinam == 2))
      napammenh = "Giản Hạ Thủy";
    else if ((cannam == 5 && chinam == 3) || (cannam == 6 && chinam == 4))
      napammenh = "Thành Đầu Thổ";
    else if ((cannam == 7 && chinam == 5) || (cannam == 8 && chinam == 6))
      napammenh = "Bạch Lạp Kim";
    else if ((cannam == 9 && chinam == 7) || (cannam == 10 && chinam == 8))
      napammenh = "Dương Liễu Mộc";
    else if ((cannam == 1 && chinam == 9) || (cannam == 2 && chinam == 10))
      napammenh = "Tuyền Trung Thủy";
    else if ((cannam == 3 && chinam == 11) || (cannam == 4 && chinam == 12))
      napammenh = "Ốc Thượng Thổ";
    else if ((cannam == 5 && chinam == 1) || (cannam == 6 && chinam == 2))
      napammenh = "Tích Lịch Hỏa";
    else if ((cannam == 7 && chinam == 3) || (cannam == 8 && chinam == 4))
      napammenh = "Tùng Bách Mộc";
    else if ((cannam == 9 && chinam == 5) || (cannam == 10 && chinam == 6))
      napammenh = "Trường Lưu Thủy";
    else if ((cannam == 1 && chinam == 7) || (cannam == 2 && chinam == 8))
      napammenh = "Sa Trung Kim";
    else if ((cannam == 3 && chinam == 9) || (cannam == 4 && chinam == 10))
      napammenh = "Sơn Hạ Hỏa";
    else if ((cannam == 5 && chinam == 11) || (cannam == 6 && chinam == 12))
      napammenh = "Bình Địa Mộc";
    else if ((cannam == 7 && chinam == 1) || (cannam == 8 && chinam == 2))
      napammenh = "Bích Thượng Thổ";
    else if ((cannam == 9 && chinam == 3) || (cannam == 10 && chinam == 4))
      napammenh = "Kim Bạc Kim";
    else if ((cannam == 1 && chinam == 5) || (cannam == 2 && chinam == 6))
      napammenh = "Phú Đăng Hỏa";
    else if ((cannam == 3 && chinam == 7) || (cannam == 4 && chinam == 8))
      napammenh = "Thiên Hà Thủy";
    else if ((cannam == 5 && chinam == 9) || (cannam == 6 && chinam == 10))
      napammenh = "Đại Trạch Thổ";
    else if ((cannam == 7 && chinam == 11) || (cannam == 8 && chinam == 12))
      napammenh = "Thoa Xuyến Kim";
    else if ((cannam == 9 && chinam == 1) || (cannam == 10 && chinam == 2))
      napammenh = "Tang Đố Mộc";
    else if ((cannam == 1 && chinam == 3) || (cannam == 2 && chinam == 4))
      napammenh = "Đại Khê Thủy";
    else if ((cannam == 3 && chinam == 5) || (cannam == 4 && chinam == 6))
      napammenh = "Sa Trung Thổ";
    else if ((cannam == 5 && chinam == 7) || (cannam == 6 && chinam == 8))
      napammenh = "Thiên Thượng Hỏa";
    else if ((cannam == 7 && chinam == 9) || (cannam == 8 && chinam == 10))
      napammenh = "Thạch Lựu Mộc";
    else if ((cannam == 9 && chinam == 11) || (cannam == 10 && chinam == 12))
      napammenh = "Đại Hải Thủy";

    context.fillStyle = 'black';
    context.fillText("Mệnh:", x, y + 106);
    context.fillStyle = '#353580';
    context.fillText(napammenh, x + 80, y + 106);


    var cancungmenh = fix10(fix10(cannam * 2 + 1) + cungmenh - 1);
    var chicungmenh = fix12(cungmenh + 2);

    if (chicungmenh == 1 || chicungmenh == 7 || chicungmenh == 2 || chicungmenh == 8)
      a = 0;
    if (chicungmenh == 11 || chicungmenh == 12 || chicungmenh == 5 || chicungmenh == 6)
      a = 2;
    if (chicungmenh == 3 || chicungmenh == 4 || chicungmenh == 9 || chicungmenh == 10)
      a = 1;

    if (cancungmenh == 1 || cancungmenh == 2) b = 1;
    if (cancungmenh == 3 || cancungmenh == 4) b = 2;
    if (cancungmenh == 5 || cancungmenh == 6) b = 3;
    if (cancungmenh == 7 || cancungmenh == 8) b = 4;
    if (cancungmenh == 9 || cancungmenh == 10) b = 5;

    var hanh = new Array();
    hanh[2] = "Thủy Nhị Cục";
    hanh[3] = "Mộc Tam Cục";
    hanh[4] = "Kim Tứ Cục";
    hanh[5] = "Thổ Ngũ Cục";
    hanh[6] = "Hỏa Lục Cục";

    var ihanh;
    var cuc;
    ihanh = a + b;
    if (a + b > 5) ihanh = a + b - 5;

    if (ihanh == 1) cuc = 4;
    if (ihanh == 2) cuc = 2;
    if (ihanh == 3) cuc = 6;
    if (ihanh == 4) cuc = 5;
    if (ihanh == 5) cuc = 3;

    context.fillStyle = 'black';
    context.fillText("Cục:", x, y + 122);
    context.fillStyle = '#353580';
    context.fillText(hanh[cuc], x + 80, y + 122);

    context.fillStyle = 'black';
    context.fillText("Âm/Dương:", x, y + 138);
    context.fillStyle = '#353580';
    context.fillText(amduong, x + 80, y + 138);

    if (namxem != 0) {
      var tuoi = namxem - namduong + 1;
      var canxem = namxem % 10;
      var chixem = namxem % 12;
      canxem = fix10(canxem + 7);
      chixem = fix12(chixem + 9);
      context.fillStyle = 'black';
      context.fillText("Năm Xem:", x, y + 154);
      context.fillStyle = '#353580';
      context.fillText(namxem + " (" + can[canxem] + " " + chi[chixem] + ")", x + 80, y + 154);
      context.fillStyle = 'black';
      context.fillText("Tuổi:", x, y + 170);
      context.fillStyle = '#353580';
      context.fillText(tuoi, x + 80, y + 170);


    }
    //	else
    //	{
    //		context.fillStyle = 'black';
    //		context.font = "bold 10pt Arial";
    //		context.fillText("(Lá số an theo Tử Vi Ứng Dụng)", x, y + 144);
    //	}


    var kim = '#5A5A5A';
    var moc = '#037100';
    var thuy = 'black';
    var hoa = '#FF0000';
    var tho = '#FF7E00';

    //	context.font = "bold 14pt Arial";
    //	context.fillStyle = "#FF8C00";
    //	context.textAlign = "center";
    //	context.fillText("TỬ VI ỨNG DỤNG", w*2, h + 45);

    context.textAlign = "left";

    var i, j;
    context.font = 'bold 6.5pt Arial';
    context.textAlign = 'left';
    for (i = 1; i <= 12; i++) {
      j = fix12(i + 2);
      var mausac;
      if (i == 1 || i == 2)
        mausac = moc;
      else if (i == 4 || i == 5)
        mausac = hoa;
      else if (i == 7 || i == 8)
        mausac = kim;
      else if (i == 10 || i == 11)
        mausac = thuy;
      else mausac = tho;

      printw(chi[j], mausac, xcung[i] + 5, ycung[i] + 15);
    }

    // an đại hạn
    //
    context.font = 'bold 8pt Arial Black';
    context.textAlign = "right";
    var daihan;
    var j = cungmenh;
    var step;
    if (amduong == "Dương Nam" || amduong == "Âm Nữ")
      step = 1;
    else
      step = -1;
    for (i = 1; i <= 12; i++) {
      daihan = cuc + (i - 1) * 10;
      j = fix12(j);
      printw(daihan, 'black', xcung[j] + w - 5, ycung[j] + 15);
      j = j + step;
    }
    //

    //an tiểu hạn
    //
    context.font = 'bold 8pt Verdana';
    context.textAlign = "center";
    var tieuhan;
    if (chinam == 3 || chinam == 7 || chinam == 11) {
      tieuhan = 3;
    } else if (chinam == 9 || chinam == 1 || chinam == 5) {
      tieuhan = 9;
    } else if (chinam == 6 || chinam == 10 || chinam == 2) {
      tieuhan = 6;
    } else tieuhan = 12;
    xpoint[1] += 5;
    xpoint[2] += 5;
    xpoint[3] += 5;
    xpoint[4] += 5;

    xpoint[7] -= 5;
    xpoint[8] -= 5;
    xpoint[9] -= 5;
    xpoint[10] -= 5;

    ypoint[4] += 15;
    ypoint[5] += 15;
    ypoint[6] += 15;

    ypoint[7] += 15;

    ypoint[10] -= 5;
    ypoint[11] -= 5;
    ypoint[12] -= 5;
    ypoint[1] -= 5;

    ypoint[2] += 5;
    ypoint[3] += 5;
    ypoint[8] += 5;
    ypoint[9] += 5;

    var n = chinam;
    var k = tieuhan;
    var step;
    if (amduong == "Dương Nam" || amduong == "Âm Nam")
      step = 1;
    else step = -1;

    for (i = 1; i <= 12; i++) {
      k = fix12(k);
      n = fix12(n);
      j = fix12(n - 2);
      var mausac;
      if (j == 1 || j == 2)
        mausac = moc;
      else if (j == 4 || j == 5)
        mausac = hoa;
      else if (j == 7 || j == 8)
        mausac = kim;
      else if (j == 10 || j == 11)
        mausac = thuy;
      else mausac = tho;
      if (k == 1 || k == 2 || k == 3 || k == 4)
        context.textAlign = "left";
      else if (k == 7 || k == 8 || k == 9 || k == 10)
        context.textAlign = "right";
      else context.textAlign = "center";
      printw(chi[n], mausac, xpoint[k], ypoint[k]);
      k++;
      n = n + step;
    }
    //
    //an TUẦN - TRIỆT
    //
    context.font = 'bold 8pt Arial';
    context.textAlign = "left";

    function antuantriet(tcannam, tchinam) {
      var tuankhong;
      var trietkhong;
      j = tchinam + 1;
      var start = tcannam;
      if (tcannam == 1)
        start = 2;
      for (i = start; i != 1; i = fix10(i + 1)) {
        j++;
        j = fix12(j);
      }
      tuankhong = fix12(j - 2);
      if (tuankhong == 5 || tuankhong == 6) {
        tuankhong = 5;
        x = xcung[tuankhong] + w - 25;
        y = ycung[tuankhong] + h - 5;
      } else if (tuankhong == 11 || tuankhong == 12) {
        tuankhong = 11;
        x = xcung[tuankhong] - 25;
        y = ycung[tuankhong] - 7;
      } else {
        if (tuankhong == 7 || tuankhong == 8)
          tuankhong = 7;
        else if (tuankhong == 9 || tuankhong == 10)
          tuankhong = 9;
        else if (tuankhong == 1 || tuankhong == 2)
          tuankhong = 2;
        else if (tuankhong == 3 || tuankhong == 4)
          tuankhong = 4;

        x = xcung[tuankhong] + w / 2 - 25;
        y = ycung[tuankhong] + h - 7;
      }

      if (tcannam == 1 || tcannam == 6) trietkhong = 7;
      else if (tcannam == 2 || tcannam == 7) trietkhong = 5;
      else if (tcannam == 3 || tcannam == 8) trietkhong = 4;
      else if (tcannam == 4 || tcannam == 9) trietkhong = 2;
      else if (tcannam == 5 || tcannam == 10) trietkhong = 11;

      var x, y;
      if (tuankhong != trietkhong) {
        context.fillStyle = 'black';
        context.fillRect(x, y, 50, 12);
        context.font = "bold 8pt Arial";
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText("TUẦN", x + 25, y + 10);

        if (trietkhong == 7 || trietkhong == 2 || trietkhong == 4) {
          x = xcung[trietkhong] + w / 2 - 25;
          y = ycung[trietkhong] + h - 7;
        } else if (trietkhong == 5) {
          x = xcung[trietkhong] + w - 25;
          y = ycung[trietkhong] + h - 5;
        } else if (trietkhong == 11) {
          x = xcung[trietkhong] - 25;
          y = ycung[trietkhong] - 7;
        }

        context.fillStyle = 'black';
        context.fillRect(x, y, 50, 12);
        context.font = "bold 8pt Arial";
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText("TRIỆT", x + 25, y + 10);
      } else {
        if (trietkhong == 7 || trietkhong == 2 || trietkhong == 4) {
          x = xcung[trietkhong] + w / 2 - 35;
          y = ycung[trietkhong] + h - 7;
        } else if (trietkhong == 5) {
          x = xcung[trietkhong] + w - 35;
          y = ycung[trietkhong] + h - 5;
        } else if (trietkhong == 11) {
          x = xcung[trietkhong] - 35;
          y = ycung[trietkhong] - 7;
        }

        context.fillStyle = 'black';
        context.fillRect(x, y, 70, 12);
        context.font = "bold 8pt Arial";
        context.fillStyle = 'white';
        context.textAlign = 'center';
        context.fillText("TUẦN-TRIỆT", x + 35, y + 10);
      }
    }

    //an sao nhóm 1
    //
    function annhom1(tcungmenh, tcungthan) {
      var nhom1 = new Array();
      nhom1[1] = "MỆNH";
      nhom1[2] = "PHỤ MẪU";
      nhom1[3] = "PHÚC ĐỨC";
      nhom1[4] = "ĐIỀN TRẠCH";
      nhom1[5] = "QUAN LỘC";
      nhom1[6] = "NÔ BỘC";
      nhom1[7] = "THIÊN DI";
      nhom1[8] = "TẬT ÁCH";
      nhom1[9] = "TÀI BẠCH";
      nhom1[10] = "TỬ TỨC";
      nhom1[11] = "PHU THÊ";
      nhom1[12] = "HUYNH ĐỆ";
      //function printw(chu, mauchu, typ,s, f, talight, vx, vy)
      j = cungmenh;

      context.font = 'bold 8pt Arial';
      context.textAlign = 'center';
      for (i = 1; i <= 12; i++) {
        var temp = fix12(j);
        var texttemp = "";
        if (temp == cungthan)
          texttemp = "-THÂN";
        printw(nhom1[i] + texttemp, '#353580', xcung[temp] + w / 2, ycung[temp] + 15);
        j++;
      }
    }

    antuantriet(cannam, chinam);
    annhom1(cungmenh, cungthan);

    //an nhóm 2
    //
    var line = new Array();
    var row = new Array();
    for (i = 1; i <= 12; i++) {
      line[i] = 1;
      row[i] = 5;
    }


    var tuvi;
    var X = cuc - ngay % cuc;
    if (ngay % cuc == 0) X = 0;
    var Y = (ngay + X) / cuc;
    var z;
    if (X % 2 == 0) z = Y + X;
    if (X % 2 != 0) z = Y - X;

    context.font = 'bold 9pt Arial';

    for (i = 1; i <= 12; i++) {
      line[i] += 1;
    }

    tuvi = fix12(z);
    var chinhtinh = new Array();
    chinhtinh[1] = "TỬ VI";
    chinhtinh[2] = "LIÊM TRINH";
    chinhtinh[3] = "THIÊN ĐỒNG";
    chinhtinh[4] = "VŨ KHÚC";
    chinhtinh[5] = "THÁI DƯƠNG";
    chinhtinh[6] = "THIÊN CƠ";
    chinhtinh[7] = "THIÊN PHỦ";
    chinhtinh[8] = "THÁI ÂM";
    chinhtinh[9] = "THAM LANG";
    chinhtinh[10] = "CỰ MÔN";
    chinhtinh[11] = "THIÊN TƯỚNG";
    chinhtinh[12] = "THIÊN LƯƠNG";
    chinhtinh[13] = "THẤT SÁT";
    chinhtinh[14] = "PHÁ QUÂN";

    var ict = new Array();
    ict[1] = tuvi;
    ict[7] = 14 - tuvi;
    if (tuvi == 1) ict[7] = 1;
    var thienphu = ict[7];

    ict[2] = fix12(tuvi + 4);
    ict[3] = fix12(tuvi + 7);
    ict[4] = fix12(tuvi + 8);
    ict[5] = fix12(tuvi + 9);
    ict[6] = fix12(tuvi + 11);

    ict[8] = fix12(thienphu + 1);
    ict[9] = fix12(thienphu + 2);
    ict[10] = fix12(thienphu + 3);
    ict[11] = fix12(thienphu + 4);
    ict[12] = fix12(thienphu + 5);
    ict[13] = fix12(thienphu + 6);
    ict[14] = fix12(thienphu + 10);

    //printw("TỬ VI", tho, xcung[tuvi] + row[tuvi], ycung[tuvi] + line[tuvi]*14);
    //textUnderline = function(context, text, x, y, color, textSize, align)
    var numct = new Array();
    for (i = 1; i <= 12; i++) {
      numct[i] = 0;
    }
    for (i = 1; i <= 14; i++) {
      numct[ict[i]] += 1;
    }

    for (i = 1; i <= 14; i++) {
      var mau;
      if (i == 4 || i == 13)
        mau = kim;
      else if (i == 6 || i == 12 || i == 9)
        mau = moc;
      else if (i == 3 || i == 8 || i == 11 || i == 14 || i == 10)
        mau = thuy;
      else if (i == 1 || i == 7)
        mau = tho;
      else if (i == 2 || i == 5)
        mau = hoa;
      if (numct[ict[i]] == 1) {
        context.textAlign = 'center';
        printw(chinhtinh[i], mau, xcung[ict[i]] + w / 2, ycung[ict[i]] + line[ict[i]] * 16);
        textUnderline(context, chinhtinh[i], xcung[ict[i]] + w / 2, ycung[ict[i]] + line[ict[i]] * 16, mau, "10pt", context.textAlign);
        //line[ict[i]] += 1;
      } else if (numct[ict[i]] == 2) {
        if (row[ict[i]] > w / 2) {
          context.textAlign = 'right';
        } else context.textAlign = 'left';
        printw(chinhtinh[i], mau, xcung[ict[i]] + row[ict[i]], ycung[ict[i]] + line[ict[i]] * 16);
        textUnderline(context, chinhtinh[i], xcung[ict[i]] + row[ict[i]], ycung[ict[i]] + line[ict[i]] * 16, mau, "10pt", context.textAlign);
        row[ict[i]] += w - 10;
      }
      //row[ict[i]]+=w/2 - 5;
    }

    context.font = 'bold 8pt Arial';
    context.textAlign = 'left';
    for (i = 1; i <= 12; i++) {
      line[i] = 3.4;
      row[i] = 5;
    }

    function ansao(start, step, flag) {
      var temp = 0;
      var result;
      //0 thi lui
      if (flag == 0)
        temp = temp - step + 1;
      else
        //1 thi tien
        temp = temp + step - 1;
      result = fix12(temp + start);
      return result;
    }

    var vanxuong = ansao(9, gio, 0);
    var vankhuc = ansao(3, gio, 1);
    var taphu = ansao(3, thang, 1);
    var huubat = ansao(9, thang, 0);
    var thaitue = fix12(chinam - 2);

    var locton;
    if (cannam == 1) locton = 1;
    else if (cannam == 2) locton = 2;
    else if (cannam == 3) locton = 4;
    else if (cannam == 4) locton = 5;
    else if (cannam == 5) locton = 4;
    else if (cannam == 6) locton = 5;
    else if (cannam == 7) locton = 7;
    else if (cannam == 8) locton = 8;
    else if (cannam == 9) locton = 10;
    else if (cannam == 10) locton = 11;

    var kinhduong = fix12(locton + 1);
    var dala = fix12(locton - 1);

    var thienkhoi;
    var thienviet;

    if (cannam == 1) {
      thienkhoi = 12;
      thienviet = 6;
    } else if (cannam == 2) {
      thienkhoi = 11;
      thienviet = 7;
    } else if (cannam == 3) {
      thienkhoi = 10;
      thienviet = 8;
    } else if (cannam == 4) {
      thienkhoi = 8;
      thienviet = 10;
    } else if (cannam == 5 || cannam == 7) {
      thienkhoi = 6;
      thienviet = 12;
    } else if (cannam == 6) {
      thienkhoi = 7;
      thienviet = 11;
    } else if (cannam == 8) {
      thienkhoi = 5;
      thienviet = 1;
    } else if (cannam == 9) {
      thienkhoi = 4;
      thienviet = 2;
    } else if (cannam == 10) {
      thienkhoi = 2;
      thienviet = 4;
    }


    var tuongtinh;
    if (chinam == 3 || chinam == 7 || chinam == 11) {
      tuongtinh = 5;
    } else if (chinam == 4 || chinam == 8 || chinam == 12) {
      tuongtinh = 2;
    } else if (chinam == 5 || chinam == 9 || chinam == 1) {
      tuongtinh = 11;
    } else if (chinam == 6 || chinam == 10 || chinam == 2) {
      tuongtinh = 8;
    }


    var nhom3 = new Array();
    nhom3[1] = "QUAN PHÙ";
    nhom3[2] = "LONG TRÌ";
    nhom3[3] = "TUẾ PHÁ";
    nhom3[4] = "THIÊN HƯ";
    nhom3[5] = "TANG MÔN";
    nhom3[6] = "THÁI TUẾ";
    nhom3[7] = "BẠCH HỔ";
    nhom3[8] = "ĐIẾU KHÁCH";
    nhom3[9] = "HỒNG LOAN";
    nhom3[10] = "ĐÀO HOA";
    nhom3[11] = "THIÊN HỈ";
    nhom3[12] = "THIÊN ĐỨC";
    nhom3[13] = "NGUYỆT ĐỨC";
    nhom3[14] = "PHƯỢNG CÁC";
    nhom3[15] = "CÔ THẦN";
    nhom3[16] = "QUẢ TÚ";
    nhom3[17] = "HOA CÁI";


    var in3 = new Array();
    in3[1] = fix12(thaitue + 4);
    in3[2] = ansao(3, chinam, 1);
    in3[3] = fix12(thaitue + 6);
    in3[4] = ansao(5, chinam, 1);
    in3[5] = fix12(thaitue + 2);
    in3[6] = thaitue;
    in3[7] = fix12(thaitue - 4);
    in3[8] = fix12(thaitue - 2);
    in3[9] = ansao(2, chinam, 0);
    in3[10] = fix12(tuongtinh - 3);
    in3[11] = fix12(in3[9] + 6);
    in3[12] = fix12(thaitue - 3);
    in3[13] = fix12(thaitue + 5);
    in3[14] = ansao(9, chinam, 0);


    var cothan, quatu;
    if (chinam == 3 || chinam == 4 || chinam == 5) {
      cothan = 4;
      quatu = 12;
    } else if (chinam == 6 || chinam == 7 || chinam == 8) {
      cothan = 7;
      quatu = 3;
    } else if (chinam == 9 || chinam == 10 || chinam == 11) {
      cothan = 10;
      quatu = 6;
    } else if (chinam == 12 || chinam == 1 || chinam == 2) {
      cothan = 1;
      quatu = 9;
    }
    in3[15] = cothan;
    in3[16] = quatu;
    in3[17] = fix12(tuongtinh + 4);

    for (i = 1; i <= 17; i++) {
      var mau;
      //sao kim
      if (i == 7 || i == 17)
        mau = kim;
      else if (i == 5 || i == 10 || i == 14)
        mau = moc;
      else if (i == 2 || i == 4 || i == 9 || i == 11)
        mau = thuy;
      else if (i == 1 || i == 3 || i == 6 || i == 8 || i == 12 || i == 13)
        mau = hoa;
      else mau = tho;

      if (row[in3[i]] > w) {
        line[in3[i]] += 1;
        row[in3[i]] = 5;
      }
      if (row[in3[i]] > w / 2)
        context.textAlign = 'right';
      else
        context.textAlign = 'left';
      printw(nhom3[i], mau, xcung[in3[i]] + row[in3[i]], ycung[in3[i]] + line[in3[i]] * 14);
      //textUnderline(context, nhom3[i], xcung[in3[i]] + row[in3[i]], ycung[in3[i]] + line[in3[i]]*14, mau, "8pt", "left");
      row[in3[i]] += w - 10;
    }

    //an nhom 4

    for (i = 1; i <= 12; i++) {
      line[i] += 1;
      row[i] = 5;
    }

    var nhom4 = new Array();
    nhom4[1] = "VĂN XƯƠNG";
    nhom4[2] = "VĂN KHÚC";
    nhom4[3] = "TẢ PHÙ";
    nhom4[4] = "HỮU BẬT";
    nhom4[5] = "ÂN QUANG";
    nhom4[6] = "THIÊN QUÝ";
    nhom4[7] = "TAM THAI";
    nhom4[8] = "BÁT TỌA";
    nhom4[9] = "THIÊN KHÔI";
    nhom4[10] = "THIÊN VIỆT";
    nhom4[11] = "THAI PHỤ";
    nhom4[12] = "PHONG CÁO";

    var in4 = new Array();
    in4[1] = vanxuong;
    in4[2] = vankhuc;
    in4[3] = taphu;
    in4[4] = huubat;
    in4[5] = fix12(vanxuong + ngay - 2);
    in4[6] = fix12(vankhuc - ngay + 2);
    in4[7] = fix12(taphu + ngay - 1);
    in4[8] = fix12(huubat - ngay + 1);
    in4[9] = thienkhoi;
    in4[10] = thienviet;
    in4[11] = fix12(vankhuc + 2);
    in4[12] = fix12(vankhuc - 2);

    for (i = 1; i <= 12; i++) {
      var mau;
      //sao kim
      mau = 'black';
      //kim:
      if (i == 1 || i == 11)
        mau = kim;
      else if (i == 8 || i == 5)
        mau = moc;

      else if (i == 2 || i == 4 || i == 7)
        mau = thuy;
      else if (i == 9 || i == 10)
        mau = hoa;
      else mau = tho;

      if (row[in4[i]] > w) {
        line[in4[i]] += 1;
        row[in4[i]] = 5;
      }
      if (row[in4[i]] > w / 2)
        context.textAlign = 'right';
      else
        context.textAlign = 'left';
      printw(nhom4[i], mau, xcung[in4[i]] + row[in4[i]], ycung[in4[i]] + line[in4[i]] * 14);
      if (i == 9 || i == 10 || i == 3 || i == 4)
        textUnderline(context, nhom4[i], xcung[in4[i]] + row[in4[i]], ycung[in4[i]] + line[in4[i]] * 14, mau, "8pt", context.textAlign);
      row[in4[i]] += w - 10;
    }
    //an nhom 6
    //
    for (i = 1; i <= 12; i++) {
      line[i] += 1;
      row[i] = 5;
    }


    var nhom6 = new Array();

    nhom6[1] = "LỘC TỒN";
    nhom6[2] = "KÌNH DƯƠNG";
    nhom6[3] = "ĐÀ LA";
    nhom6[4] = "BÁC SĨ";
    nhom6[5] = "LỰC SĨ";
    nhom6[6] = "THANH LONG";
    nhom6[7] = "TIỂU HAO";
    nhom6[8] = "TƯỚNG QUÂN";
    nhom6[9] = "TẤU THƯ";
    nhom6[10] = "PHI LIÊM";
    nhom6[11] = "HỈ THẦN";
    nhom6[12] = "BỆNH PHÙ";
    nhom6[13] = "ĐẠI HAO";
    nhom6[14] = "PHỤC BINH";
    nhom6[15] = "QUAN PHỦ";
    nhom6[16] = "QUỐC ẤN";
    nhom6[17] = "ĐƯỜNG PHÙ";


    var in6 = new Array();
    in6[1] = locton;
    in6[2] = kinhduong;
    in6[3] = dala;
    in6[4] = locton;

    for (i = 5; i <= 15; i++) {
      if (amduong == "Dương Nam" || amduong == "Âm Nữ")
        in6[i] = fix12(in6[i - 1] + 1);
      else
        in6[i] = fix12(in6[i - 1] - 1);
    }

    in6[16] = fix12(locton + 8);
    in6[17] = fix12(locton - 7);

    for (i = 1; i <= 17; i++) {
      var mau;
      //sao kim
      /*Kim: 2 3 9
      moc: 8
      thuy: 4 6
      hoa: 5 7  10 11 13 15 14
      tho: 1 12 */
      if (i == 2 || i == 3 || i == 9)
        mau = kim;
      else if (i == 8 || i == 17)
        mau = moc;
      else if (i == 4 || i == 6)
        mau = thuy;
      else if (i == 1 || i == 12 || i == 16)
        mau = tho;
      else mau = hoa;

      if (row[in6[i]] > w) {
        line[in6[i]] += 1;
        row[in6[i]] = 5;
      }
      if (row[in6[i]] > w / 2)
        context.textAlign = 'right';
      else
        context.textAlign = 'left';
      printw(nhom6[i], mau, xcung[in6[i]] + row[in6[i]], ycung[in6[i]] + line[in6[i]] * 14);
      if (i == 2 || i == 3)
        textUnderline(context, nhom6[i], xcung[in6[i]] + row[in6[i]], ycung[in6[i]] + line[in6[i]] * 14, mau, "8pt", context.textAlign);
      row[in6[i]] += w - 10;
    }
    //
    //an nhom 5
    //
    for (i = 1; i <= 12; i++) {
      line[i] += 1;
      row[i] = 5;
    }

    var nhom5 = new Array()
    nhom5[1] = "THIÊN DIÊU";
    nhom5[2] = "THIÊN Y";
    nhom5[3] = "THIÊN KHÔNG";
    nhom5[4] = "ĐỊA KIẾP";
    nhom5[5] = "HÓA QUYỀN";
    nhom5[6] = "HÓA KHOA";
    nhom5[7] = "HÓA LỘC";
    nhom5[8] = "HÓA KỴ";
    nhom5[9] = "THIÊN HÌNH";
    nhom5[10] = "HỎA TINH";
    nhom5[11] = "LINH TINH";

    var bd_hoa;
    var bd_linh;

    if (chinam == 3 || chinam == 7 || chinam == 11) {
      bd_hoa = 12;
      bd_linh = 2;
    } else if (chinam == 4 || chinam == 8 || chinam == 12) {
      bd_hoa = 8;
      bd_linh = 9;
    } else if (chinam == 5 || chinam == 9 || chinam == 1) {
      bd_hoa = 1;
      bd_linh = 9;
    } else if (chinam == 6 || chinam == 10 || chinam == 2) {
      bd_hoa = 2;
      bd_linh = 9;
    }

    var hoaloc;
    var hoaquyen;
    var hoakhoa;
    var hoaky;

    if (cannam == 1) {
      hoaloc = ict[2];
      hoaquyen = ict[14];
      hoakhoa = ict[4];
      hoaky = ict[5];
    } else if (cannam == 2) {
      hoaloc = ict[6];
      hoaquyen = ict[12];
      hoakhoa = ict[1];
      hoaky = ict[8];
    } else if (cannam == 3) {
      hoaloc = ict[3];
      hoaquyen = ict[6];
      hoakhoa = vanxuong;
      hoaky = ict[2];
    } else if (cannam == 4) {
      hoaloc = ict[8];
      hoaquyen = ict[3];
      hoakhoa = ict[6];
      hoaky = ict[10];
    } else if (cannam == 5) {
      hoaloc = ict[9];
      hoaquyen = ict[8];
      hoakhoa = huubat;
      hoaky = ict[6];
    } else if (cannam == 6) {
      hoaloc = ict[4];
      hoaquyen = ict[9];
      hoakhoa = ict[12];
      hoaky = vankhuc;
    } else if (cannam == 7) {
      hoaloc = ict[5];
      hoaquyen = ict[4];
      hoakhoa = ict[8];
      hoaky = ict[3];
    } else if (cannam == 8) {
      hoaloc = ict[10];
      hoaquyen = ict[5];
      hoakhoa = vankhuc;
      hoaky = vanxuong;
    } else if (cannam == 9) {
      hoaloc = ict[12];
      hoaquyen = ict[1];
      hoakhoa = taphu;
      hoaky = ict[4];
    } else if (cannam == 10) {
      hoaloc = ict[14];
      hoaquyen = ict[10];
      hoakhoa = ict[8];
      hoaky = ict[9];
    }
    /*chinhtinh[1] = "TỬ VI";
    chinhtinh[2] = "LIÊM TRINH";
    chinhtinh[3] = "THIÊN ĐỒNG";
    chinhtinh[4] = "VŨ KHÚC";
    chinhtinh[5] = "THÁI DƯƠNG";
    chinhtinh[6] = "THIÊN CƠ";
    chinhtinh[7] = "THIÊN PHỦ";
    chinhtinh[8] = "THÁI ÂM";
    chinhtinh[9] = "THAM LANG";
    chinhtinh[10] = "CỰ MÔN";
    chinhtinh[11] = "THIÊN TƯỚNG";
    chinhtinh[12] = "THIÊN LƯƠNG";
    chinhtinh[13] = "THẤT SÁT";
    chinhtinh[14] = "PHÁ QUÂN";*/
    var in5 = new Array();
    in5[9] = ansao(8, thang, 1);
    in5[1] = fix12(in5[9] + 4);
    in5[2] = in5[1];
    if (amduong == "Dương Nam" || amduong == "Âm Nữ") {
      in5[10] = ansao(bd_hoa, gio, 1);
      in5[11] = ansao(bd_linh, gio, 0);
    } else {
      in5[10] = ansao(bd_hoa, gio, 0);
      in5[11] = ansao(bd_linh, gio, 1);
    }
    in5[5] = hoaquyen;
    in5[6] = hoakhoa;
    in5[7] = hoaloc;
    in5[8] = hoaky;

    in5[3] = ansao(10, gio, 0);
    in5[4] = ansao(10, gio, 1);

    for (i = 1; i <= 11; i++) {
      var mau;
      //sao kim
      mau = 'black';
      if (i == 5 || i == 6 || i == 7)
        mau = moc;
      else if (i == 8 || i == 1 || i == 2)
        mau = thuy;
      else if (i == 10 || i == 11 || i == 3 || i == 4 || i == 9)
        mau = hoa;

      if (row[in5[i]] > w) {
        line[in5[i]] += 1;
        row[in5[i]] = 5;
      }
      if (row[in5[i]] > w / 2)
        context.textAlign = 'right';
      else
        context.textAlign = 'left';
      printw(nhom5[i], mau, xcung[in5[i]] + row[in5[i]], ycung[in5[i]] + line[in5[i]] * 14);
      if (i != 10 && i != 11)
        textUnderline(context, nhom5[i], xcung[in5[i]] + row[in5[i]], ycung[in5[i]] + line[in5[i]] * 14, mau, "8pt", context.textAlign);
      row[in5[i]] += w - 10;
    }


    //an nhom 8
    context.textAlign = 'right';
    for (i = 1; i <= 12; i++) {
      line[i] = 0;
      row[i] = 5;
    }

    var nhom8 = new Array();
    nhom8[1] = "THIÊN LA";
    nhom8[2] = "ĐỊA VÕNG";
    nhom8[3] = "THIÊN THƯƠNG";
    nhom8[4] = "THIÊN SỨ";
    nhom8[5] = "THIÊN KHỐC";
    nhom8[6] = "PHÁ TOÁI";
    nhom8[7] = "LƯU HÀ";
    nhom8[8] = "KIẾP SÁT";
    nhom8[9] = "THIÊN MÃ";

    var in8 = new Array();
    in8[1] = 3;
    in8[2] = 9;
    //	if (amduong == "Dương Nam" || amduong == "Âm Nữ")
    //	{
    in8[3] = fix12(cungmenh + 5);
    in8[4] = fix12(cungmenh - 5);
    //	}
    //	else
    //	{
    //		in8[3] = fix12(cungmenh - 5);
    //		in8[4] = fix12(cungmenh + 5);
    //	}
    in8[5] = ansao(5, chinam, 0);

    var phatoai;
    if (chinam == 3 || chinam == 9 || chinam == 6 || chinam == 12) {
      phatoai = 8;
    } else if (chinam == 1 || chinam == 4 || chinam == 7 || chinam == 10) {
      phatoai = 4;
    } else if (chinam == 5 || chinam == 11 || chinam == 2 || chinam == 8) {
      phatoai = 12;
    }

    in8[6] = phatoai;

    var luuha;
    if (cannam == 1)
      luuha = 8;
    else if (cannam == 2)
      luuha = 9;
    else if (cannam == 3)
      luuha = 6;
    else if (cannam == 4)
      luuha = 7;
    else if (cannam == 5)
      luuha = 4;
    else if (cannam == 6)
      luuha = 5;
    else if (cannam == 7)
      luuha = 2;
    else if (cannam == 8)
      luuha = 3;
    else if (cannam == 9)
      luuha = 10;
    else if (cannam == 10)
      luuha = 1;

    in8[7] = luuha;
    in8[8] = fix12(tuongtinh + 5);
    var thienma;
    if (chinam == 3 || chinam == 7 || chinam == 11) {
      thienma = 7;
    } else if (chinam == 9 || chinam == 1 || chinam == 5) {
      thienma = 1;
    } else if (chinam == 6 || chinam == 10 || chinam == 2) {
      thienma = 10;
    } else thienma = 4;
    in8[9] = thienma;

    for (i = 1; i <= 9; i++) {
      var mau;
      //sao kim
      mau = 'black';

      if (i == 6 || i == 8 || i == 9)
        mau = hoa;
      else if (i == 3)
        mau = tho;
      else if (i == 1 || i == 2)
        mau = kim;
      //		if (row[in8[i]] + 20 >= w)
      //		{
      //			line[in8[i]] += 1;
      //			row[in8[i]] = 5;
      //		}
      printw(nhom8[i], mau, xcung[in8[i]] + w - 5, ycung[in8[i]] + h - 8.5 - line[in8[i]] * 14);
      //textUnderline(context, nhom8[i], xcung[in8[i]] + row[in8[i]], ycung[in8[i]] + line[in8[i]]*14, mau, "8pt", "left");
      //		row[in8[i]]+=w/2 - 5;
      line[in8[i]] += 1;
    }

    //an nhom 7
    //	for (i = 1; i<=12; i++)
    //	{
    //		line[i] += 1;
    //		row[i] = 5;
    //	}
    context.textAlign = 'left';
    var nhom7 = new Array()
    nhom7[1] = "TRƯỜNG SINH";
    nhom7[2] = "MỘC DỤC";
    nhom7[3] = "QUAN ĐỚI";
    nhom7[4] = "LÂM QUAN";
    nhom7[5] = "ĐẾ VƯỢNG";
    nhom7[6] = "SUY";
    nhom7[7] = "BỆNH";
    nhom7[8] = "TỬ";
    nhom7[9] = "MỘ";
    nhom7[10] = "TUYỆT";
    nhom7[11] = "THAI";
    nhom7[12] = "DƯỠNG";

    var in7 = new Array();
    if (cuc == 2 || cuc == 5)
      in7[1] = 7;
    else if (cuc == 3)
      in7[1] = 10;
    else if (cuc == 4)
      in7[1] = 4;
    else if (cuc == 6)
      in7[1] = 1;

    for (i = 2; i <= 12; i++) {
      if (amduong == "Dương Nam" || amduong == "Âm Nữ")
        in7[i] = fix12(in7[i - 1] + 1);
      else
        in7[i] = fix12(in7[i - 1] - 1);
    }

    for (i = 1; i <= 12; i++) {
      var mau;
      //sao kim
      mau = 'black';
      if (i == 3 || i == 4 || i == 5)
        mau = kim;
      else if (i == 12)
        mau = moc;
      else if (i == 7)
        mau = hoa;
      else if (i == 9 || i == 10 || i == 11)
        mau = tho;
      else mau = thuy;

      if (row[in7[i]] + 20 >= w) {
        line[in7[i]] += 1;
        row[in7[i]] = 5;
      }
      printw(nhom7[i], mau, xcung[in7[i]] + 5, ycung[in7[i]] + h - 8.5);
      //textUnderline(context, nhom7[i], xcung[in7[i]] + row[in7[i]], ycung[in7[i]] + line[in7[i]]*14, mau, "8pt", "left");
      //row[in7[i]]+=w/2 - 5;
    }


  }
