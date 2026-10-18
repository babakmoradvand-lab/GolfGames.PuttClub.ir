# برنامهٔ ساخت و دروازه‌های پذیرش

## 0. آماده‌سازی مخزن
- مخزن مستقل جدید با تاریخچهٔ مستقل؛ هیچ remote به repo قبلی متصل نشود.
- Pin کردن Unreal 5.8 برای شروع؛ ثبت نسخهٔ Xcode/SDK بعد از بررسی مک کاربر.
- Git LFS برای فایل‌های باینری/Blender/GLB/texture؛ فایل‌های سنگین در Git معمولی قرار نگیرند.
- CI و build validation فقط بعد از مشخص‌شدن محیط Unreal/SDK.

## 1. Vertical slice کاراکتر و کنترل (اولویت اول)
- Third-person camera rig، Enhanced Input برای touch/gamepad/keyboard، movement states (idle, walk, jog, stop, pivot, interact, golf-ready).
- انتخاب/ساخت یک اسکلت استاندارد، retargetable locomotion set و animation blueprint؛ بدون وابستگی به mesh قدیمی.
- ارزیابی حس حرکت با تست کاربر، camera collision/occlusion، motion smoothing و frame pacing.

## 2. تعامل و حالت‌های فعالیت
- Interface تعاملی مشترک و activity state machine.
- فقط یک interaction نمونه را کامل کن؛ منطق لباس/انیمیشن تغییر حالت را جدا و قابل‌گسترش طراحی کن.
- رفتار حمام پوشیده و غیرصریح.

## 3. آزمون دارایی Blender
- یک سوئیت یا بخش زمین را به‌صورت modular GLB/FBX وارد کن.
- تست scale, axis, PBR, collision, LOD, navmesh و named anchors.
- قراردادن assets خارج از source code با Git LFS و ثبت مجوزها.

## 4. Golf gameplay slice
- tee, ball, club, aiming, swing input, launch/flight/landing; سپس لاگون/فیرِوی و ذخیرهٔ وضعیت.
- تست‌های deterministic و regression برای قوانین توپ و وضعیت round.

## 5. پلتفرم‌ها
- Windows/macOS development build؛ Android package + نصب آزمایشی محلی.
- iPhone PWA جداگانه، با نسخهٔ وب سازگار و کیفیت مقیاس‌شونده.
- Supabase پس از پیاده‌سازی local save، auth و RLS بررسی می‌شود.

## Gate قبل از گسترش محیط
کاربر نمونه را روی دستگاه‌های واقعی آزمایش و تأیید کند: حرکت/دوربین حس جدید و رضایت‌بخش دارند، تعامل قابل‌فهم است، عملکرد پایدار است و asset pipeline قابل‌اعتماد است. تا این gate پاس نشود، شش سوئیت یا محتوای انبوه تولید نمی‌شود.
