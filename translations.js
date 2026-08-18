const I18N = {
    currentLang: localStorage.getItem('njrail_lang') || 'en',

    translations: {
        en: {
            // Header
            site_title: "NJ Rail",
            site_subtitle: "Fastest way to check NJ TRANSIT times",
            schedule_updated: "Schedule Updated: Aug 8, 2026",

            // Saved Routes
            saved_commutes: "Your Saved Commutes",

            // Form
            travel_date: "Travel Date",
            origin: "Origin",
            destination: "Destination",
            where_from: "Where from?",
            where_to: "Where to?",
            connecting_trips: "Connecting Trips",
            find_trains: "Find Trains",
            last_train_tonight: "Last train tonight",
            save_this_route: "Save this route",
            swap_stations: "Swap Stations",

            // Suggestions
            popular_stations: "Popular Stations",
            available_destinations: "Available Destinations",
            loading_schedule: "Loading schedule data...",
            no_trains_station_date: "No trains available from this station on the selected date.",

            // Messages
            select_departure_first: "Please select a departure station first.",
            select_valid_stations: "Please select valid stations from the list.",
            no_trains_found: "No trains found (even with transfers).",
            route_already_saved: "Route already saved!",
            route_saved: "Route saved to your commutes!",
            select_stations_first: "Please select stations first.",
            link_copied: "Route link copied! Share it with others.",
            link_copy_failed: "Failed to copy link.",

            // Train Cards
            schedule_view: "Schedule View",
            share: "SHARE",
            share_trip: "Share trip",
            towards: "TOWARDS",
            next: "NEXT",
            departed: "DEPARTED",
            sched: "SCHED",
            show_stops: "Show stops",
            hide_stops: "Hide stops",
            stops: "stops",
            transfer_wait: "transfer wait",
            transfer_at: "Transfer at",
            arr: "arr",
            dep: "dep",
            wait: "wait",

            // Time labels
            m_left: "m left",
            h_left: "h",
            m_left_suffix: "m left",

            // Holidays
            new_years: "New Year's Day (Holiday Schedule)",
            independence: "Independence Day (Holiday Schedule)",
            veterans: "Veterans Day (Potential Holiday Schedule)",
            christmas: "Christmas Day (Holiday Schedule)",
            sunday_schedule: "Sunday Schedule in effect",
            saturday_schedule: "Saturday Schedule in effect",

            // Empty State
            no_trains_route: "No trains found for this route on the selected date.",
            date_in_past: "This date is in the past.",
            select_future_date: "Please select today's date or a future date to see current schedules.",
            late_night: "It's late night / early morning (2-5 AM).",
            service_pauses: "Most NJ TRANSIT service pauses during these hours. Check for the first morning trains starting around 5:00 AM.",
            no_direct_route: "No direct route found between these stations.",
            try_connecting: "Try enabling 'Connecting Trips' to find multi-leg journeys.",
            try_different_date: "Try checking a different date or verify if there is a known service disruption.",
            couldnt_find: "We couldn't find any scheduled trips matching your search.",
            recommendation: "Recommendation",

            // Footer
            independent_tool: "Independent commuter tool · Powered by NJ TRANSIT® GTFS data",
            home: "Home",
            fares: "Fares",
            about: "About",
            privacy: "Privacy",
            terms: "Terms",
            contact: "Contact",
            schedule_data: "Schedule data: Updated daily from public GTFS",
            trademark: "NJ TRANSIT® is a registered trademark of New Jersey Transit Corporation. This site is NOT affiliated with or endorsed by NJ TRANSIT.",

            // SEO
            instant_lookup: "Instant Lookup",
            instant_lookup_desc: "No logins, no bloat. Just enter your destination and get your train times in seconds.",
            offline_ready: "Offline Ready",
            offline_ready_desc: "Our schedules are cached on your device. Check your commute even in the deepest tunnels.",
            saved_routes: "Saved Routes",
            saved_routes_desc: "Save your daily commute with one tap. Get instant access to your next 3 trains home.",
            popular_routes: "Popular NJ Transit Routes",

            // Share
            share_title_route: "NJ Rail: {dep} to {arr}",
            share_text_route: "NJ Transit train schedule for {date}: {dep} to {arr}",
            share_title_trip: "Train at {time} ({dep} → {arr})",
            share_text_trip: "Check this NJ Transit train schedule for {date}: {dep_time} to {arr_time}",
            note_static: "Note: Data is static (GTFS). Real-time delays not included.",

            // Language selector
            language: "Language",
            to_word: "to",
            train_schedule_title: "Train Schedule"
        },

        es: {
            site_title: "NJ Rail",
            site_subtitle: "La forma más rápida de consultar horarios de NJ TRANSIT",
            schedule_updated: "Horario Actualizado: 8 ago 2026",

            saved_commutes: "Tus Rutas Guardadas",

            travel_date: "Fecha de Viaje",
            origin: "Origen",
            destination: "Destino",
            where_from: "¿Desde dónde?",
            where_to: "¿Hacia dónde?",
            connecting_trips: "Viajes con Transbordo",
            find_trains: "Buscar Trenes",
            last_train_tonight: "Último tren hoy",
            save_this_route: "Guardar esta ruta",
            swap_stations: "Intercambiar Estaciones",

            popular_stations: "Estaciones Populares",
            available_destinations: "Destinos Disponibles",
            loading_schedule: "Cargando horarios...",
            no_trains_station_date: "No hay trenes disponibles desde esta estación en la fecha seleccionada.",

            select_departure_first: "Por favor seleccione una estación de salida primero.",
            select_valid_stations: "Por favor seleccione estaciones válidas de la lista.",
            no_trains_found: "No se encontraron trenes (ni siquiera con transbordos).",
            route_already_saved: "¡Ruta ya guardada!",
            route_saved: "¡Ruta guardada en tus recorridos!",
            select_stations_first: "Por favor seleccione estaciones primero.",
            link_copied: "¡Enlace de ruta copiado! Compártelo con otros.",
            link_copy_failed: "Error al copiar el enlace.",

            schedule_view: "Vista de Horario",
            share: "COMPARTIR",
            share_trip: "Compartir viaje",
            towards: "HACIA",
            next: "PRÓXIMO",
            departed: "PARTIÓ",
            sched: "HORARIO",
            show_stops: "Mostrar paradas",
            hide_stops: "Ocultar paradas",
            stops: "paradas",
            transfer_wait: "espera de transbordo",
            transfer_at: "Transbordo en",
            arr: "lleg",
            dep: "sal",
            wait: "espera",

            m_left: "min restantes",
            h_left: "h",
            m_left_suffix: "min restantes",

            new_years: "Día de Año Nuevo (Horario Festivo)",
            independence: "Día de la Independencia (Horario Festivo)",
            veterans: "Día de los Veteranos (Posible Horario Festivo)",
            christmas: "Navidad (Horario Festivo)",
            sunday_schedule: "Horario de Domingo en vigor",
            saturday_schedule: "Horario de Sábado en vigor",

            no_trains_route: "No se encontraron trenes para esta ruta en la fecha seleccionada.",
            date_in_past: "Esta fecha está en el pasado.",
            select_future_date: "Por favor seleccione la fecha de hoy o una fecha futura para ver los horarios actuales.",
            late_night: "Es de madrugada / temprano en la mañana (2-5 AM).",
            service_pauses: "La mayoría del servicio de NJ TRANSIT se pausa durante estas horas. Consulte los primeros trenes de la mañana alrededor de las 5:00 AM.",
            no_direct_route: "No se encontró ruta directa entre estas estaciones.",
            try_connecting: "Intente habilitar 'Viajes con Transbordo' para encontrar viajes con múltiples piernas.",
            try_different_date: "Intente consultar otra fecha o verifique si hay interrupciones de servicio conocidas.",
            couldnt_find: "No pudimos encontrar viajes programados que coincidan con su búsqueda.",
            recommendation: "Recomendación",

            independent_tool: "Herramienta independiente para viajeros · Impulsada por datos GTFS de NJ TRANSIT®",
            home: "Inicio",
            fares: "Tarifas",
            about: "Acerca de",
            privacy: "Privacidad",
            terms: "Términos",
            contact: "Contacto",
            schedule_data: "Datos de horarios: Actualizados diariamente desde GTFS público",
            trademark: "NJ TRANSIT® es una marca registrada de New Jersey Transit Corporation. Este sitio NO está afiliado ni respaldado por NJ TRANSIT.",

            instant_lookup: "Búsqueda Instantánea",
            instant_lookup_desc: "Sin registros, sin complicaciones. Solo ingrese su destino y obtenga los horarios en segundos.",
            offline_ready: "Listo sin Conexión",
            offline_ready_desc: "Nuestros horarios se guardan en su dispositivo. Consulte su viaje incluso en los túneles más profundos.",
            saved_routes: "Rutas Guardadas",
            saved_routes_desc: "Guarde su viaje diario con un toque. Acceda instantáneamente a sus próximos 3 trenes a casa.",
            popular_routes: "Rutas Populares de NJ Transit",

            share_title_route: "NJ Rail: {dep} a {arr}",
            share_text_route: "Horario de tren NJ Transit para {date}: {dep} a {arr}",
            share_title_trip: "Tren a las {time} ({dep} → {arr})",
            share_text_trip: "Consulte este horario de tren NJ Transit para {date}: {dep_time} a {arr_time}",
            note_static: "Nota: Los datos son estáticos (GTFS). No se incluyen retrasos en tiempo real.",

            language: "Idioma",
            to_word: "a",
            train_schedule_title: "Horario de Tren"
        },

        zh: {
            site_title: "NJ Rail",
            site_subtitle: "查询 NJ TRANSIT 列车时刻的最快方式",
            schedule_updated: "时刻表更新：2026年8月8日",

            saved_commutes: "已保存的通勤路线",

            travel_date: "出行日期",
            origin: "出发站",
            destination: "目的地",
            where_from: "从哪里出发？",
            where_to: "到哪里去？",
            connecting_trips: "换乘路线",
            find_trains: "查找列车",
            last_train_tonight: "今晚末班车",
            save_this_route: "保存此路线",
            swap_stations: "交换站点",

            popular_stations: "热门站点",
            available_destinations: "可到达的目的地",
            loading_schedule: "正在加载时刻表数据...",
            no_trains_station_date: "所选日期该站点没有可用列车。",

            select_departure_first: "请先选择出发站。",
            select_valid_stations: "请从列表中选择有效的站点。",
            no_trains_found: "未找到列车（即使含换乘）。",
            route_already_saved: "路线已保存！",
            route_saved: "路线已保存到您的通勤列表！",
            select_stations_first: "请先选择站点。",
            link_copied: "路线链接已复制！与他人分享。",
            link_copy_failed: "复制链接失败。",

            schedule_view: "时刻表视图",
            share: "分享",
            share_trip: "分享行程",
            towards: "开往",
            next: "下一班",
            departed: "已出发",
            sched: "计划",
            show_stops: "显示站点",
            hide_stops: "隐藏站点",
            stops: "个站点",
            transfer_wait: "换乘等待",
            transfer_at: "在以下站点换乘",
            arr: "到达",
            dep: "出发",
            wait: "等待",

            m_left: "分钟后出发",
            h_left: "小时",
            m_left_suffix: "分钟后出发",

            new_years: "元旦（节假日时刻表）",
            independence: "独立日（节假日时刻表）",
            veterans: "退伍军人日（可能的节假日时刻表）",
            christmas: "圣诞节（节假日时刻表）",
            sunday_schedule: "执行周日时刻表",
            saturday_schedule: "执行周六时刻表",

            no_trains_route: "所选日期该路线没有列车。",
            date_in_past: "此日期已过。",
            select_future_date: "请选择今天或未来的日期查看当前时刻表。",
            late_night: "现在是深夜/凌晨（2-5点）。",
            service_pauses: "大多数 NJ TRANSIT 服务在此时段暂停。请查看上午5:00左右的首班列车。",
            no_direct_route: "这两站之间没有直达路线。",
            try_connecting: "请尝试启用「换乘路线」查找多段行程。",
            try_different_date: "请尝试查询其他日期或确认是否有已知的服务中断。",
            couldnt_find: "我们无法找到与您搜索匹配的计划班次。",
            recommendation: "建议",

            independent_tool: "独立通勤工具 · 由 NJ TRANSIT® GTFS 数据驱动",
            home: "首页",
            fares: "票价",
            about: "关于",
            privacy: "隐私",
            terms: "条款",
            contact: "联系",
            schedule_data: "时刻表数据：每日从公共 GTFS 更新",
            trademark: "NJ TRANSIT® 是 New Jersey Transit Corporation 的注册商标。本站与 NJ TRANSIT 无关或未获其认可。",

            instant_lookup: "即时查询",
            instant_lookup_desc: "无需登录，无多余内容。输入目的地即可秒获列车时刻。",
            offline_ready: "离线可用",
            offline_ready_desc: "我们的时刻表缓存在您的设备上。即使在最深的隧道中也能查看通勤信息。",
            saved_routes: "保存路线",
            saved_routes_desc: "一键保存日常通勤路线。即时获取接下来3班回家的列车。",
            popular_routes: "NJ Transit 热门路线",

            share_title_route: "NJ Rail：{dep} 到 {arr}",
            share_text_route: "NJ Transit 列车时刻 {date}：{dep} 到 {arr}",
            share_title_trip: "{time} 的列车（{dep} → {arr}）",
            share_text_trip: "查看此 NJ Transit 列车时刻 {date}：{dep_time} 到 {arr_time}",
            note_static: "注意：数据为静态（GTFS），不包含实时延误信息。",

            language: "语言",
            to_word: "到",
            train_schedule_title: "列车时刻表"
        },

        ru: {
            site_title: "NJ Rail",
            site_subtitle: "Быстрый способ узнать расписание NJ TRANSIT",
            schedule_updated: "Расписание обновлено: 8 авг 2026",

            saved_commutes: "Сохранённые маршруты",

            travel_date: "Дата поездки",
            origin: "Отправление",
            destination: "Прибытие",
            where_from: "Откуда?",
            where_to: "Куда?",
            connecting_trips: "Пересадочные рейсы",
            find_trains: "Найти поезда",
            last_train_tonight: "Последний поезд сегодня",
            save_this_route: "Сохранить маршрут",
            swap_stations: "Поменять станции",

            popular_stations: "Популярные станции",
            available_destinations: "Доступные направления",
            loading_schedule: "Загрузка расписания...",
            no_trains_station_date: "На выбранную дату нет доступных поездов с этой станции.",

            select_departure_first: "Пожалуйста, сначала выберите станцию отправления.",
            select_valid_stations: "Пожалуйста, выберите действительные станции из списка.",
            no_trains_found: "Поезда не найдены (даже с пересадками).",
            route_already_saved: "Маршрут уже сохранён!",
            route_saved: "Маршрут сохранён в ваши поездки!",
            select_stations_first: "Пожалуйста, сначала выберите станции.",
            link_copied: "Ссылка на маршрут скопирована! Поделитесь с другими.",
            link_copy_failed: "Не удалось скопировать ссылку.",

            schedule_view: "Просмотр расписания",
            share: "ПОДЕЛИТЬСЯ",
            share_trip: "Поделиться поездкой",
            towards: "НАПРАВЛЕНИЕ",
            next: "СЛЕДУЮЩИЙ",
            departed: "ОТПРАВЛЕН",
            sched: "ПО РАСПИСАНИЮ",
            show_stops: "Показать остановки",
            hide_stops: "Скрыть остановки",
            stops: "остановок",
            transfer_wait: "ожидание пересадки",
            transfer_at: "Пересадка на",
            arr: "приб",
            dep: "отпр",
            wait: "ожидание",

            m_left: "мин до отправки",
            h_left: "ч",
            m_left_suffix: "мин до отправки",

            new_years: "Новый год (праздничное расписание)",
            independence: "День независимости (праздничное расписание)",
            veterans: "День ветеранов (возможно праздничное расписание)",
            christmas: "Рождество (праздничное расписание)",
            sunday_schedule: "Действует воскресное расписание",
            saturday_schedule: "Действует субботнее расписание",

            no_trains_route: "На выбранную дату нет поездов по этому маршруту.",
            date_in_past: "Эта дата уже прошла.",
            select_future_date: "Пожалуйста, выберите сегодняшнюю или будущую дату для просмотра текущего расписания.",
            late_night: "Поздняя ночь / раннее утро (2-5 утра).",
            service_pauses: "Большинство маршрутов NJ TRANSIT не работают в это время. Проверьте первые утренние поезда примерно с 5:00 утра.",
            no_direct_route: "Прямой маршрут между этими станциями не найден.",
            try_connecting: "Попробуйте включить «Пересадочные рейсы» для поиска маршрутов с пересадками.",
            try_different_date: "Попробуйте другую дату или проверьте наличие известных сбоев в работе.",
            couldnt_find: "Мы не смогли найти запланированные поезда по вашему запросу.",
            recommendation: "Рекомендация",

            independent_tool: "Независимый инструмент для путешественников · На основе данных GTFS NJ TRANSIT®",
            home: "Главная",
            fares: "Тарифы",
            about: "О нас",
            privacy: "Конфиденциальность",
            terms: "Условия",
            contact: "Контакты",
            schedule_data: "Данные расписания: Обновляются ежедневно из открытых GTFS",
            trademark: "NJ TRANSIT® — зарегистрированная торговая марка New Jersey Transit Corporation. Данный сайт НЕ связан с NJ TRANSIT и не одобрен им.",

            instant_lookup: "Мгновенный поиск",
            instant_lookup_desc: "Без регистрации и лишнего. Введите направление и получите расписание за секунды.",
            offline_ready: "Работает офлайн",
            offline_ready_desc: "Наше расписание кэшируется на вашем устройстве. Проверяйте поездки даже в самых глубоких тоннелях.",
            saved_routes: "Сохранённые маршруты",
            saved_routes_desc: "Сохраните ежедневную поездку одним нажатием. Мгновенный доступ к следующим 3 поездам домой.",
            popular_routes: "Популярные маршруты NJ Transit",

            share_title_route: "NJ Rail: {dep} → {arr}",
            share_text_route: "Расписание поезда NJ Transit на {date}: {dep} → {arr}",
            share_title_trip: "Поезд в {time} ({dep} → {arr})",
            share_text_trip: "Проверьте расписание NJ Transit на {date}: {dep_time} → {arr_time}",
            note_static: "Примечание: Данные статические (GTFS). Задержки в реальном времени не включены.",

            language: "Язык",
            to_word: "→",
            train_schedule_title: "Расписание поездов"
        },

        bn: {
            site_title: "NJ Rail",
            site_subtitle: "NJ TRANSIT সময়সূচী দেখার দ্রুততম উপায়",
            schedule_updated: "সময়সূচী আপডেট: ৮ আগস্ট, ২০২৬",

            saved_commutes: "আপনার সংরক্ষিত যাতায়াত",

            travel_date: "ভ্রমণের তারিখ",
            origin: "যাত্রাস্থল",
            destination: "গন্তব্য",
            where_from: "কোথা থেকে?",
            where_to: "কোথায়?",
            connecting_trips: "সংযোগকারী ট্রিপ",
            find_trains: "ট্রেন খুঁজুন",
            last_train_tonight: "আজ রাতের শেষ ট্রেন",
            save_this_route: "এই রুট সংরক্ষণ করুন",
            swap_stations: "স্টেশন পরিবর্তন করুন",

            popular_stations: "জনপ্রিয় স্টেশন",
            available_destinations: "উপলব্ধ গন্তব্য",
            loading_schedule: "সময়সূচী লোড হচ্ছে...",
            no_trains_station_date: "নির্বাচিত তারিখে এই স্টেশন থেকে কোনো ট্রেন পাওয়া যায়নি।",

            select_departure_first: "অনুগ্রহ করে প্রথমে একটি যাত্রাস্থল নির্বাচন করুন।",
            select_valid_stations: "অনুগ্রহ করে তালিকা থেকে বৈধ স্টেশন নির্বাচন করুন।",
            no_trains_found: "কোনো ট্রেন পাওয়া যায়নি (সংযোগ সহ নয়)।",
            route_already_saved: "রুট ইতিমধ্যে সংরক্ষিত!",
            route_saved: "রুট আপনার যাতায়াতে সংরক্ষিত হয়েছে!",
            select_stations_first: "অনুগ্রহ করে প্রথমে স্টেশন নির্বাচন করুন।",
            link_copied: "রুট লিঙ্ক কপি হয়েছে! অন্যদের সাথে শেয়ার করুন।",
            link_copy_failed: "লিঙ্ক কপি করা যায়নি।",

            schedule_view: "সময়সূচীর দৃশ্য",
            share: "শেয়ার",
            share_trip: "ট্রিপ শেয়ার করুন",
            towards: "গন্তব্য",
            next: "পরবর্তী",
            departed: "ছেড়ে গেছে",
            sched: "সময়সূচী",
            show_stops: "স্টপ দেখান",
            hide_stops: "স্টপ লুকান",
            stops: "স্টপ",
            transfer_wait: "সংযোগ অপেক্ষা",
            transfer_at: "এখানে সংযোগ",
            arr: "পৌঁছেছে",
            dep: "ছেড়েছে",
            wait: "অপেক্ষা",

            m_left: "মিনিট বাকি",
            h_left: "ঘণ্টা",
            m_left_suffix: "মিনিট বাকি",

            new_years: "নববর্ষ (ছুটির সময়সূচী)",
            independence: "স্বাধীনতা দিবস (ছুটির সময়সূচী)",
            veterans: "সেনানী দিবস (সম্ভাব্য ছুটির সময়সূচী)",
            christmas: "বড়দিন (ছুটির সময়সূচী)",
            sunday_schedule: "রবিবারের সময়সূচী কার্যকর",
            saturday_schedule: "শনিবারের সময়সূচী কার্যকর",

            no_trains_route: "নির্বাচিত তারিখে এই রুটে কোনো ট্রেন পাওয়া যায়নি।",
            date_in_past: "এই তারিখ অতীতে।",
            select_future_date: "বর্তমান সময়সূচী দেখতে অনুগ্রহ করে আজকের তারিখ বা ভবিষ্যতের তারিখ নির্বাচন করুন।",
            late_night: "রাত / ভোরের সময় (২-৫ টা)।",
            service_pauses: "বেশিরভাগ NJ TRANSIT সেবা এই সময়ে বন্ধ থাকে। সকাল ৫:০০ টার পর প্রথম সকালের ট্রেন দেখুন।",
            no_direct_route: "এই স্টেশনগুলোর মধ্যে কোনো সরাসরি রুট পাওয়া যায়নি।",
            try_connecting: "বহু-পদের যাত্রা খুঁজে পেতে 'সংযোগকারী ট্রিপ' চালু করার চেষ্টা করুন।",
            try_different_date: "অন্য তারিখ চেষ্টা করুন বা পরিচিত সেবা ব্যাঘাত যাচাই করুন।",
            couldnt_find: "আমরা আপনার অনুসন্ধানের সাথে মেলে এমন কোনো নির্ধারিত ট্রিপ খুঁজে পাইনি।",
            recommendation: "সুপারিশ",

            independent_tool: "স্বাধীন যাত্রী সরঞ্জাম · NJ TRANSIT® GTFS ডেটা দ্বারা চালিত",
            home: "হোম",
            fares: "ভাড়া",
            about: "সম্পর্কে",
            privacy: "গোপনীয়তা",
            terms: "শর্তাবলী",
            contact: "যোগাযোগ",
            schedule_data: "সময়সূচীর ডেটা: পাবলিক GTFS থেকে দৈনিক আপডেট",
            trademark: "NJ TRANSIT® হলো New Jersey Transit Corporation এর নিবন্ধিত ট্রেডমার্ক। এই সাইট NJ TRANSIT এর সাথে সম্পর্কিত বা অনুমোদিত নয়।",

            instant_lookup: "তাৎক্ষণিক অনুসন্ধান",
            instant_lookup_desc: "কোনো লগইন নেই, কোনো জটিলতা নেই। শুধু আপনার গন্তব্য লিখুন এবং সেকেন্ডের মধ্যে সময়সূচী পান।",
            offline_ready: "অফলাইন প্রস্তুত",
            offline_ready_desc: "আমাদের সময়সূচী আপনার ডিভাইসে ক্যাশ করা হয়। সবচেয়ে গভীর সুড়ঙ্গেও আপনার যাতায়াত দেখুন।",
            saved_routes: "সংরক্ষিত রুট",
            saved_routes_desc: "একটি ট্যাপে আপনার দৈনিক যাতায়াত সংরক্ষণ করুন। বাড়িতে পরবর্তী ৩টি ট্রেনে তাৎক্ষণিক প্রবেশ।",
            popular_routes: "জনপ্রিয় NJ Transit রুট",

            share_title_route: "NJ Rail: {dep} থেকে {arr}",
            share_text_route: "NJ Transit ট্রেন সময়সূচী {date}: {dep} থেকে {arr}",
            share_title_trip: "{time} এর ট্রেন ({dep} → {arr})",
            share_text_trip: "এই NJ Transit ট্রেন সময়সূচী দেখুন {date}: {dep_time} থেকে {arr_time}",
            note_static: "দ্রষ্টব্য: ডেটা স্থির (GTFS)। রিয়েল-টাইম বিলম্ব অন্তর্ভুক্ত নয়।",

            language: "ভাষা",
            to_word: "থেকে",
            train_schedule_title: "ট্রেন সময়সূচী"
        }
    },

    t(key) {
        const lang = this.currentLang;
        return this.translations[lang]?.[key] || this.translations.en[key] || key;
    },

    setLang(lang) {
        this.currentLang = lang;
        localStorage.setItem('njrail_lang', lang);
        document.documentElement.lang = lang === 'zh' ? 'zh-CN' : lang;
        this.applyTranslations();
    },

    applyTranslations() {
        document.querySelectorAll('[data-i18n]').forEach(el => {
            const key = el.getAttribute('data-i18n');
            const translated = this.t(key);
            if (el.tagName === 'INPUT') {
                if (el.hasAttribute('data-i18n-placeholder')) {
                    el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
                }
                el.value = translated;
            } else {
                el.textContent = translated;
            }
        });
        document.querySelectorAll('[data-i18n-placeholder]').forEach(el => {
            el.placeholder = this.t(el.getAttribute('data-i18n-placeholder'));
        });
        document.querySelectorAll('[data-i18n-html]').forEach(el => {
            const key = el.getAttribute('data-i18n-html');
            el.innerHTML = this.t(key);
        });
    }
};
