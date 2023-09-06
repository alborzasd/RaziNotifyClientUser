package com.razinotifyclientuser;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.NativeModule;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;

import java.text.ParseException;
import java.text.SimpleDateFormat;
import java.util.Date;
import java.util.Map;
import java.util.HashMap;

import saman.zamani.persiandate.PersianDate;
import saman.zamani.persiandate.PersianDateFormat;

public class ComputationModule extends ReactContextBaseJavaModule {
    ComputationModule(ReactApplicationContext context){
        super(context);
    }

    @NonNull
    @Override
    public String getName() {
        return "ComputationModule";
    }

    @ReactMethod
    public void getCustomPersianDateFormat(String dateISOStr, Promise promise) {
        // ISO 8621 - output from mongodb
        // create a parser/formatter object
        SimpleDateFormat sdf = new SimpleDateFormat("yyyy-MM-dd'T'HH:mm:ss.SSS'Z'");
        // the 'Z' can not be parsed so it was passed as raw string to formatter
        sdf.setTimeZone(java.util.TimeZone.getTimeZone("UTC"));

        Date oldDate;
        Date currentDate = new Date();

        try {
            oldDate = sdf.parse(dateISOStr);
        } catch (ParseException e) {
            promise.resolve("---");
            return;
        }

        PersianDate oldPersianDate = new PersianDate(oldDate);
        // PersianDate currentPersianDate = new PersianDate(currentDate);

        // refer to doc
        // https://github.com/samanzamani/PersianDate#example

        // 13:05, ... 24-hour zero prefixed
        PersianDateFormat currentDayFormatter = new PersianDateFormat("H:i",
                PersianDateFormat.PersianDateNumberCharacter.FARSI);
        // shanbe, yekshanbe, ... (in persian characters)
        PersianDateFormat currentWeekFormatter = new PersianDateFormat("l",
                PersianDateFormat.PersianDateNumberCharacter.FARSI);
        // 28 mordad, 05 farvardin, ... (in persian characters)
        PersianDateFormat currentYearFormatter = new PersianDateFormat("d F",
                PersianDateFormat.PersianDateNumberCharacter.FARSI);
        // 1401/05/06
        PersianDateFormat oldYearFormatter = new PersianDateFormat("Y/m/d",
                PersianDateFormat.PersianDateNumberCharacter.FARSI);

        long diffInMilliSeconds = currentDate.getTime() - oldDate.getTime();
        int diffInDays = (int)(diffInMilliSeconds / 86400000);
        boolean isNegative = diffInMilliSeconds < 0;
        boolean isLessThan24Hour = diffInDays == 0; // negative is ignored
        boolean isLessThanAWeek = diffInDays < (7 - 1);
        boolean isLessThanAYear = diffInDays < (365 - 30);

        String result = "---";
        if(isNegative) {
            // NOP
        }
        else if(isLessThan24Hour) {
            result = currentDayFormatter.format(oldPersianDate);
        }
        else if (isLessThanAWeek) {
            result = currentWeekFormatter.format(oldPersianDate);
        }
        else if (isLessThanAYear) {
            result = currentYearFormatter.format(oldPersianDate);
        }
        else {
            result = oldYearFormatter.format(oldPersianDate);
        }

        // String result2=
        //    diffInMilliSeconds + "__" + diffInDays + "__" + result;

        promise.resolve(result);
    }
}
