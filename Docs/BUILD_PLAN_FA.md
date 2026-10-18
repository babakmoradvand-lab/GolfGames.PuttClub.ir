# برنامهٔ ساخت و دروازه‌های پذیرش

## 0. نظم مخزن و نام‌گذاری
- یک مخزن با مسیرهای جدا: گلف ۱ (وب) و گلف ۲ (Unreal 5.8)؛ تعریف دقیق در `Docs/Project_Naming_FA.md`.
- تغییرات هر دو نسخه در یک commit/push هم‌زمان؛ Pages بعد از هر انتشار بررسی شود.
- Git LFS برای فایل‌های باینری/Blender/GLB/texture؛ فایل‌های سنگین در Git معمولی قرار نگیرند.
- Build validation گلف ۲ پس از بازشدن پروژه در Unreal 5.8 روی مک انجام می‌شود.

## 1. بازسازی تجربهٔ آغازین (اولویت صفر)
- مسیر سینمایی کوتاه تا نمای زندهٔ باشگاه و کنترل مستقیم بازیکن؛ بدون ورود اجباری، ورود مهمان نمایشی یا صفحهٔ مستقل «ورود به بازی».
- مسیر منو، pause، تنظیمات و تعامل زمینه‌ای را پیش از تولید محتوای انبوه طراحی کن.
- منبع UI، کیفیت تصویر و اجرای اول را در `Docs/AAA_Rebuild_UX_Architecture_FA.md` ثبت کن.

## 2. Vertical slice کاراکتر و کنترل
- Third-person camera rig و Enhanced Input برای keyboard/mouse/gamepad؛ لمس برای مرحلهٔ بعد و نسخهٔ جدا.
- locomotion states: idle, walk, jog, stop, pivot, interact, golf-ready؛ دوربین با collision/occlusion و smoothing.
- اسکلت/ریگ و انیمیشن مستقل و قابل retarget؛ انتقال‌های باکیفیت و پیوسته، نه اتکا به mesh قدیمی.
- ارزیابی حس حرکت، خوانایی تعامل، camera framing و frame pacing در build اجراشده.

## 3. جهان و تعامل
- یک قطعهٔ محدود clubhouse/زمین با هویت هنری، نور، صدای محیط و دست‌کم یک NPC واکنشی.
- interface تعاملی مشترک، context prompts و state transition؛ فعالیت از محیط قابل‌دسترسی باشد.
- نمایش قابلیت‌ها فقط وقتی کامل و قابل‌آزمون‌اند؛ آیتم منوییِ صرفاً placeholder نساز.

## 4. آزمون دارایی Blender
- یک بخش زمین یا فضای clubhouse را modular وارد کن.
- تست scale, axis, PBR, collision, LOD/Nanite eligibility, navmesh و named anchors.
- ثبت مجوز، نسخه و منشأ assetها؛ assetها خارج از source code و فایل‌های حجیم با Git LFS.

## 5. Golf gameplay slice
- tee, ball, club, aiming, swing input, launch/flight/landing؛ سپس fairway/green/hazard و ذخیرهٔ محلی.
- هماهنگی montage/notify ضربه با فیزیک، صدا و دوربین.
- تست‌های deterministic و regression برای قوانین توپ و وضعیت round.

## 6. پلتفرم‌ها
- Windows/macOS development build؛ Android package + نصب آزمایشی محلی.
- iPhone PWA جداگانه، با نسخهٔ وب سازگار و کیفیت مقیاس‌شونده.
- Supabase پس از پیاده‌سازی local save، auth و RLS بررسی می‌شود.

## Gate قبل از گسترش محیط
کاربر نمونه را روی دستگاه‌های واقعی آزمایش و تأیید کند: حرکت/دوربین حس جدید و رضایت‌بخش دارند، تعامل قابل‌فهم است، عملکرد پایدار است و asset pipeline قابل‌اعتماد است. تا این gate پاس نشود، شش سوئیت یا محتوای انبوه تولید نمی‌شود.
