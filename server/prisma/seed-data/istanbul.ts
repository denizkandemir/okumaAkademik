import { City, ReadingLevel, TextTheme } from '../../src/generated/prisma/enums.js';
import { chest, story } from './build.js';
import type { SeedCity } from './types.js';

const city = City.ISTANBUL;
const level = ReadingLevel.BASLANGIC;

/** 1. durak — "Boğaz'ın Hikâyeleri" (2.-4. sınıf; kısa cümleler, temel kelimeler) */
export const istanbul: SeedCity = {
  city,
  lessons: [
    story(city, {
      position: 1,
      slug: 'vapurda-simit',
      theme: TextTheme.PAYLASMAK,
      title: 'Vapurda Simit',
      summary:
        'Ece’nin dedesiyle vapura binip martılarla simit paylaştığı neşeli bir Boğaz yolculuğu.',
      level,
      paragraphs: [
        'Ece ile dedesi bir pazar sabahı vapura bindiler. Vapur, Kadıköy’den Eminönü’ne gidecekti. Ece en sevdiği yere, vapurun arka tarafına oturdu.',
        'Dedesi iskelede iki sıcak simit almıştı. Simitlerin üstü susamlıydı ve mis gibi kokuyordu. Ece simidini iki eliyle sıkıca tuttu.',
        'Vapur denizde ilerlerken beyaz martılar peşine takıldı. Kanatlarını açıp rüzgârda süzülüyorlardı. Ece onları hayranlıkla izledi.',
        'Ece simidinden küçük bir parça kopardı ve elini havaya uzattı. Bir martı hızla geldi, parçayı kaptı ve uçup gitti. Ece önce şaşırdı, sonra kahkahalarla güldü.',
        'Vapur iskeleye yanaşınca Ece martılara el salladı. “Haftaya yine geleceğiz!” dedi dedesine. Dedesi gülümseyerek başını salladı.',
      ],
      questions: [
        {
          prompt: 'Vapur nereden nereye gidiyordu?',
          options: ['Eminönü’nden Üsküdar’a', 'Kadıköy’den Eminönü’ne', 'Beşiktaş’tan Kadıköy’e'],
          correctIndex: 1,
          hint: 'İpucu: Birinci paragrafta vapurun nereye gideceği yazıyor.',
          explanation: 'Doğru! Vapur Kadıköy’den Eminönü’ne gidiyordu.',
        },
        {
          prompt: 'Martılar rüzgârda “süzülüyorlardı.” Bu ne demek?',
          options: [
            'Kanat çırpmadan yavaşça uçuyorlardı',
            'Suya dalıp balık tutuyorlardı',
            'Vapurun üstünde yürüyorlardı',
          ],
          correctIndex: 0,
          hint: 'İpucu: Martıların kanatlarını açıp rüzgârda ne yaptığını düşün.',
          explanation: 'Aferin! Süzülmek, kanat çırpmadan havada kayar gibi uçmaktır.',
        },
        {
          prompt: 'Martı simit parçasını kapınca Ece nasıl hissetti?',
          options: ['Çok kızdı', 'Korkup ağladı', 'Önce şaşırdı, sonra güldü'],
          correctIndex: 2,
          hint: 'İpucu: Dördüncü paragrafın son cümlesine bak.',
          explanation: 'Harika! Ece önce şaşırdı, sonra bu tatlı anı kahkahalarla karşıladı.',
        },
      ],
      glossary: [
        { word: 'iskelede', meaning: 'Vapurların yanaştığı, insanların inip bindiği yerde.' },
        { word: 'susamlıydı', meaning: 'Üstünde susam denen küçük tohumlar vardı.' },
        { word: 'süzülüyorlardı', meaning: 'Kanat çırpmadan, havada kayar gibi uçuyorlardı.' },
      ],
    }),
    story(city, {
      position: 2,
      slug: 'bahcedeki-domatesler',
      theme: TextTheme.SABIR,
      title: 'Bahçedeki Domatesler',
      summary:
        'Elif ile dedesinin bahçeye diktiği fidelerin kıpkırmızı domateslere dönüşme hikâyesi.',
      level,
      paragraphs: [
        'Elif ile dedesi baharda bahçeye domates fidesi diktiler. Toprağı birlikte kazdılar, fideleri dikkatle yerleştirdiler.',
        'Elif her gün fidelere su verdi. Dedesi ona, bitkilerin güneşi ve suyu çok sevdiğini anlattı. Elif, fidelerin her gün biraz daha uzadığını görüyordu.',
        'Önce küçük sarı çiçekler açtı. Arılar çiçeklerin etrafında vızıldadı. Sonra çiçeklerin yerinde minik yeşil domatesler belirdi.',
        'Yaz gelince domatesler kıpkırmızı oldu. Elif ilk domatesi kopardığında çok heyecanlandı. Domates, güneşten sıcacık olmuştu. Hemen koşup dedesine gösterdi.',
        'O akşam annesi bahçenin domatesleriyle nefis bir salata yaptı. Herkes sofraya oturdu. Elif, “Emeğimizin tadı başka!” dedi. Dedesi de gülümseyerek başını salladı.',
      ],
      questions: [
        {
          prompt: 'Elif ile dedesi bahçeye ne diktiler?',
          options: ['Domates fidesi', 'Elma ağacı', 'Çiçek tohumu'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyenin ilk cümlesine bir daha bak.',
          explanation: 'Doğru! Baharda bahçeye domates fidesi diktiler.',
        },
        {
          prompt: 'Elif fidelere neden her gün su verdi?',
          options: [
            'Toprak kirlenmesin diye',
            'Dedesi kızmasın diye',
            'Bitkiler suyu sevdiği için',
          ],
          correctIndex: 2,
          hint: 'İpucu: İkinci paragrafta dedesinin Elif’e anlattıklarını oku.',
          explanation: 'Aferin! Bitkiler büyümek için suya ve güneşe ihtiyaç duyar.',
        },
        {
          prompt: 'Elif neden “Emeğimizin tadı başka!” dedi?',
          options: [
            'Salata çok tuzlu olduğu için',
            'Domatesleri kendileri yetiştirdikleri için',
            'Domatesleri marketten aldıkları için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Elif her gün fidelere ne yapmıştı? Emek, bir iş için harcanan çabadır.',
          explanation:
            'Harika! Domatesleri kendi emekleriyle yetiştirdikleri için tadı çok güzeldi.',
        },
      ],
      glossary: [
        { word: 'fidesi', meaning: 'Toprağa dikilmeye hazır, küçük bir bitki.' },
        { word: 'vızıldadı', meaning: 'Arı gibi “vız vız” diye ses çıkardı.' },
        { word: 'Emeğimizin', meaning: 'Bir iş için harcadığımız çabanın, uğraşımızın.' },
      ],
    }),
    story(city, {
      position: 3,
      slug: 'minik-serce',
      theme: TextTheme.YARDIMLASMA,
      title: 'Minik Serçe',
      summary:
        'Rüzgârda yuvası düşen minik serçe Pıtır’ın, arkadaşlarıyla yeni bir yuva kurma hikâyesi.',
      level,
      paragraphs: [
        'Bahçedeki büyük ağacın dalında minik bir serçe yaşardı. Adı Pıtır’dı. Küçük yuvası sıcacıktı.',
        'Pıtır her sabah erkenden uyanır, şarkı söylerdi. Komşu kuşlar onun sesini çok severdi. Bahçeye gelen çocuklar bile durup onu dinlerdi.',
        'Bir gün çok güçlü bir rüzgâr esti. Dallar sallandı, yapraklar havada uçuştu. Pıtır’ın yuvası yere düştü. Pıtır çok üzüldü.',
        'Arkadaşları hemen yardıma geldi. Kimi dal, kimi yaprak, kimi de yumuşak tüy getirdi. Hep birlikte, şarkılar söyleyerek neşeyle çalıştılar.',
        'Akşam olmadan yeni yuva hazırdı. Pıtır o gece arkadaşları için en güzel şarkısını söyledi. “Birlikte olunca her şey kolaylaşıyor,” diye düşündü.',
      ],
      questions: [
        {
          prompt: 'Komşu kuşlar Pıtır’ın nesini çok severdi?',
          options: ['Yuvasını', 'Tüylerini', 'Sesini'],
          correctIndex: 2,
          hint: 'İpucu: İkinci paragrafta Pıtır’ın her sabah ne yaptığı yazıyor.',
          explanation: 'Doğru! Pıtır her sabah şarkı söyler, komşu kuşlar da sesini çok severdi.',
        },
        {
          prompt: 'Rüzgâr esince Pıtır’ın yuvasına ne oldu?',
          options: ['Yere düştü', 'Daha da büyüdü', 'Ağaçta saklandı'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyede rüzgârın çok güçlü olduğu yazıyor. Böyle bir rüzgârda yuva ne olur?',
          explanation: 'Evet! Güçlü rüzgâr Pıtır’ın yuvasını yere düşürdü.',
        },
        {
          prompt: 'Bu hikâye bize ne anlatıyor?',
          options: [
            'Rüzgârlı havada dışarı çıkmamayı',
            'Zor anda birbirimize yardım etmeyi',
            'Sabahları geç uyanmayı',
          ],
          correctIndex: 1,
          hint: 'İpucu: Yuva düşünce arkadaşları ne yaptı? Pıtır son paragrafta ne düşündü?',
          explanation: 'Harika! Arkadaşlar birlikte çalışınca zor iş bile kolaylaşır.',
        },
      ],
      glossary: [
        { word: 'yuvası', meaning: 'Kuşların dallardan ve otlardan yaptığı küçük evi.' },
        { word: 'tüy', meaning: 'Kuşların vücudunu örten yumuşak ve hafif şey.' },
      ],
    }),
    story(city, {
      position: 4,
      slug: 'kiz-kulesinin-isiklari',
      theme: TextTheme.MERAK,
      title: 'Kız Kulesi’nin Işıkları',
      summary:
        'Mert’in anneannesiyle Üsküdar sahilinde Kız Kulesi’nin ışıklarını izlediği bir akşam.',
      level,
      paragraphs: [
        'Mert ile anneannesi akşamüstü Üsküdar sahilinde yürüyordu. Deniz pırıl pırıldı, hava serindi. Martılar başlarının üstünde uçuyordu.',
        'Mert denizin ortasındaki küçük beyaz kuleyi parmağıyla gösterdi. “Anneanne, o kule neden suyun içinde?” diye merakla sordu.',
        'Anneannesi gülümsedi. “O, Kız Kulesi. Çok eski bir kuledir. Küçük bir adanın üstünde duruyor. İnsanlar oraya küçük teknelerle gidiyor,” dedi.',
        'Güneş batarken kulenin ışıkları birer birer yandı. Işıklar denizin üstünde titreşiyordu. Sanki kule, teknelere “İyi geceler!” diyordu. Mert gözlerini kuleden ayıramadı.',
        'Eve dönünce Mert hemen kâğıdını ve boyalarını çıkardı. Kız Kulesi’ni ışıklarıyla birlikte çizdi. Resmi anneannesine hediye etti. Anneannesi resmi duvara astı.',
      ],
      questions: [
        {
          prompt: 'Kız Kulesi nerede duruyor?',
          options: ['Bir tepenin üstünde', 'Denizdeki küçük bir adada', 'Büyük bir parkın içinde'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta anneannenin anlattıklarını oku.',
          explanation: 'Doğru! Kız Kulesi denizdeki küçük bir adanın üstünde durur.',
        },
        {
          prompt: '“Mert gözlerini kuleden ayıramadı.” Bu ne demek?',
          options: [
            'Kuleye uzun uzun, hayranlıkla baktı',
            'Gözlerini sıkıca kapattı',
            'Kuleden korkup kaçtı',
          ],
          correctIndex: 0,
          hint: 'İpucu: Işıklar yanınca Mert’in kuleye nasıl baktığını düşün.',
          explanation: 'Aferin! Mert kuleyi o kadar beğendi ki ona bakmaya doyamadı.',
        },
        {
          prompt: 'Mert resmi neden anneannesine hediye etti?',
          options: [
            'Resmi hiç beğenmediği için',
            'Anneannesiyle geçirdiği güzel akşamı sevdiği için',
            'Boyaları bittiği için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Mert’in o akşam anneannesiyle neler yaşadığını hatırla.',
          explanation: 'Harika! Mert, anneannesiyle geçirdiği güzel akşamı resmiyle paylaştı.',
        },
      ],
      glossary: [
        { word: 'sahilinde', meaning: 'Denizin kıyısında.' },
        { word: 'titreşiyordu', meaning: 'Hafif hafif kıpırdayarak parlıyordu.' },
      ],
    }),
    chest(
      city,
      5,
      'Boğaz’ın ilk hazine sandığı seni bekliyor; aç bakalım içinden kaç lokum çıkacak!',
    ),
    story(city, {
      position: 6,
      slug: 'galatadan-bakinca',
      theme: TextTheme.KESIF,
      title: 'Galata’dan Bakınca',
      summary:
        'Deniz’in babasıyla Galata Kulesi’ne çıkıp İstanbul’a kuşlar gibi yukarıdan baktığı gün.',
      level,
      paragraphs: [
        'Deniz ile babası Galata Kulesi’ne gitti. Kule taştan yapılmıştı ve çok eskiydi. Tepesi sivri bir külaha benziyordu. Deniz başını kaldırıp kuleye baktı.',
        'Asansörle kulenin tepesine çıktılar. Deniz dar balkona adım attı. Rüzgâr saçlarını uçuşturdu.',
        'Aşağıda bütün şehir görünüyordu. Boğaz’da vapurlar ilerliyor, köprülerin üstünden arabalar geçiyordu. Evler minicik kutulara benziyordu. Uzakta Kız Kulesi bile görünüyordu.',
        'Deniz vapurları saymaya başladı. “Bir, iki, üç…” Sonra babasına döndü. “Baba, buradan bakınca kendimi kuş gibi hissediyorum!” dedi.',
        'Babası güldü. “Kuşlar da şehri hep böyle görüyor,” dedi. Deniz aşağı inerken bir gün kuşları izlemek için yine gelmeye karar verdi.',
      ],
      questions: [
        {
          prompt: 'Deniz ile babası nereye çıktılar?',
          options: ['Galata Kulesi’nin tepesine', 'Bir vapurun en üst katına', 'Köprünün kenarına'],
          correctIndex: 0,
          hint: 'İpucu: Hikâyenin ilk cümlesinde gittikleri yer yazıyor.',
          explanation: 'Doğru! Galata Kulesi’nin tepesine çıktılar.',
        },
        {
          prompt: 'Evler neden minicik kutulara benziyordu?',
          options: [
            'Evler çok küçük yapıldığı için',
            'Deniz çok yüksekten baktığı için',
            'Hava karardığı için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Deniz şehre nereden bakıyordu?',
          explanation: 'Aferin! Yüksekten bakınca her şey küçük görünür.',
        },
        {
          prompt: 'Deniz kulenin tepesinde kendini nasıl hissetti?',
          options: ['Uykulu', 'Sıkılmış', 'Kuş gibi'],
          correctIndex: 2,
          hint: 'İpucu: Deniz’in babasına söylediği sözü oku.',
          explanation: 'Harika! Deniz yüksekten bakınca kendini kuş gibi özgür hissetti.',
        },
      ],
      glossary: [
        { word: 'külaha', meaning: 'Ucu sivri, koni biçiminde bir şapkaya.' },
        { word: 'uçuşturdu', meaning: 'Havaya kaldırıp dağınık dağınık savurdu.' },
      ],
    }),
    story(city, {
      position: 7,
      slug: 'kapalicarsida-bir-gun',
      theme: TextTheme.SORUMLULUK,
      title: 'Kapalıçarşı’da Bir Gün',
      summary:
        'Kapalıçarşı’nın renkli lambaları arasında annesini bir an kaybeden Zeynep’in akıllıca beklediği gün.',
      level,
      paragraphs: [
        'Zeynep ile annesi, babaanneye hediye almak için Kapalıçarşı’ya gitti. Çarşı çok büyüktü. İçinde sokak sokak dükkânlar vardı.',
        'Girişte annesi Zeynep’e şöyle dedi: “Kalabalıkta birbirimizi kaybedersek olduğun yerde dur. Ben seni bulurum.” Zeynep başını salladı.',
        'Zeynep rengârenk lambaları görünce durdu. Mavi, kırmızı, yeşil camlar ışıl ışıl parlıyordu. Başını kaldırdığında annesi yanında değildi.',
        'Zeynep’in kalbi hızlı hızlı çarptı. Sonra annesinin sözünü hatırladı. Lambacının önünde durdu ve bekledi. Lambacı amca ona gülümsedi.',
        'Az sonra annesi koşarak geldi ve Zeynep’e sarıldı. “Aferin kızım, tam söylediğim gibi yaptın,” dedi. Babaanneye de o dükkândan küçük, mavi bir lamba aldılar.',
      ],
      questions: [
        {
          prompt: 'Zeynep ile annesi Kapalıçarşı’ya neden gitti?',
          options: [
            'Lamba tamir ettirmek için',
            'Babaanneye hediye almak için',
            'Yemek yemek için',
          ],
          correctIndex: 1,
          hint: 'İpucu: Birinci paragrafın ilk cümlesine bak.',
          explanation: 'Doğru! Babaanneye hediye almaya gitmişlerdi.',
        },
        {
          prompt: '“Zeynep’in kalbi hızlı hızlı çarptı.” Bu cümle ne anlatıyor?',
          options: ['Zeynep bir an endişelendi', 'Zeynep koşu yapıyordu', 'Zeynep çok uykuluydu'],
          correctIndex: 0,
          hint: 'İpucu: Zeynep başını kaldırınca annesini göremedi. O an ne hissetmiş olabilir?',
          explanation: 'Aferin! Annesini göremeyince Zeynep bir an endişelendi.',
        },
        {
          prompt: 'Bu hikâyeden ne öğreniyoruz?',
          options: [
            'Çarşıda hiç durmamayı',
            'Lambaların çok pahalı olduğunu',
            'Kaybolunca olduğumuz yerde beklemeyi',
          ],
          correctIndex: 2,
          hint: 'İpucu: Annesi girişte Zeynep’e ne söylemişti?',
          explanation: 'Harika! Kalabalıkta kaybolursak olduğumuz yerde beklemek en doğrusudur.',
        },
      ],
      glossary: [
        { word: 'dükkânlar', meaning: 'Bir şeylerin satıldığı küçük mağazalar.' },
        { word: 'rengârenk', meaning: 'Birçok farklı renkte olan.' },
        { word: 'Lambacının', meaning: 'Lamba yapıp satan kişinin.' },
      ],
    }),
    story(city, {
      position: 8,
      slug: 'iki-yakayi-baglayan-kopru',
      theme: TextTheme.AILE,
      title: 'İki Yakayı Bağlayan Köprü',
      summary:
        'Ali’nin Boğaz Köprüsü’nden geçerken bir köprünün iki kıtayı bağladığını öğrendiği gün.',
      level,
      paragraphs: [
        'Ali’nin teyzesi, İstanbul’un öbür yakasında oturuyordu. Bir cumartesi günü ailece ona gitmeye karar verdiler.',
        'Arabaları Boğaz Köprüsü’ne çıkınca Ali camdan dışarı baktı. Aşağıda masmavi deniz, denizin üstünde de küçük gemiler vardı.',
        'Babası, “Bu köprü iki kıtayı birbirine bağlıyor. Biz şimdi Asya’dan Avrupa’ya geçiyoruz,” dedi. Ali çok şaşırdı. Bir köprüyle iki kıta arasında gidip gelmek ne kadar ilginçti!',
        'Teyzesinin evinde kuzenleriyle oyunlar oynayıp güzel bir gün geçirdiler. Akşam dönerken köprünün ışıkları yanmıştı. Işıklar bir mor, bir mavi oluyordu.',
        'Ali uykulu gözlerle ışıkları izledi. “Köprüler insanları birbirine yaklaştırıyor,” diye düşündü. Annesi de ona sarılıp gülümsedi.',
      ],
      questions: [
        {
          prompt: 'Ali ve ailesi kime gidiyordu?',
          options: ['Dedesine', 'Amcasına', 'Teyzesine'],
          correctIndex: 2,
          hint: 'İpucu: Hikâyenin ilk cümlesinde öbür yakada kimin oturduğu yazıyor.',
          explanation: 'Doğru! Teyzelerini ziyarete gidiyorlardı.',
        },
        {
          prompt: 'Boğaz Köprüsü neleri birbirine bağlıyor?',
          options: ['İki kıtayı', 'İki adayı', 'İki dağı'],
          correctIndex: 0,
          hint: 'İpucu: Üçüncü paragrafta babasının söylediklerini oku.',
          explanation: 'Aferin! Köprü, Asya ile Avrupa kıtalarını birbirine bağlar.',
        },
        {
          prompt: 'Ali köprüler hakkında ne düşündü?',
          options: [
            'Çok gürültülü olduklarını',
            'İnsanları birbirine yaklaştırdıklarını',
            'Geceleri korkutucu olduklarını',
          ],
          correctIndex: 1,
          hint: 'İpucu: Son paragrafta Ali’nin aklından geçenlere bak.',
          explanation: 'Harika! Köprüler uzakları yakın eder, insanları buluşturur.',
        },
      ],
      glossary: [
        { word: 'yakasında', meaning: 'Denizle ikiye ayrılan şehrin bir tarafında.' },
        { word: 'kıtayı', meaning: 'Dünyadaki çok büyük kara parçalarından birini.' },
      ],
    }),
    story(city, {
      position: 9,
      slug: 'pirilin-istanbul-arkadaslari',
      theme: TextTheme.ARKADASLIK,
      title: 'Pırıl’ın İstanbul Arkadaşları',
      summary:
        'Pırıl’ın İstanbul’un sokak kedileriyle tanışıp İzmir yolu öncesinde vedalaştığı gün.',
      level,
      paragraphs: [
        'Pırıl, İstanbul’daki son gününde bir parkta dinleniyordu. Beyaz tüyleri güneşte parlıyor, mavi bandanasındaki nazar boncuğu ışıldıyordu.',
        'Parkın kedileri onu görünce merakla yanına geldi. Tekir Pamuk sordu: “Senin bir gözün mavi, öbürü kehribar rengi. Nerelisin sen?”',
        'Pırıl gülümsedi. “Ben bir Van kedisiyim. Memleketim Van’a dönüyorum. Önce İzmir’e uğrayacağım,” dedi.',
        'Kediler ona yol için tavsiyeler verdi. Pamuk, “Kordon’da rüzgâr çok güzeldir, mutlaka yürü!” dedi. Minik Duman ise ona bir martı tüyü hediye etti.',
        'Pırıl arkadaşlarına teşekkür etti. “Sizi hiç unutmayacağım,” dedi. Sonra kuyruğunu sallayarak yeni maceraya doğru yola çıktı. Martı tüyünü de bandanasının içine sakladı.',
      ],
      questions: [
        {
          prompt: 'Pırıl İstanbul’dan sonra hangi şehre uğrayacak?',
          options: ['Ankara’ya', 'İzmir’e', 'Antalya’ya'],
          correctIndex: 1,
          hint: 'İpucu: Üçüncü paragrafta Pırıl’ın yolculuk planını oku.',
          explanation: 'Doğru! Pırıl önce İzmir’e uğrayacak.',
        },
        {
          prompt: 'Pamuk, Pırıl’a neden nereli olduğunu sordu?',
          options: [
            'Pırıl’ın gözleri farklı renkte olduğu için',
            'Pırıl çok gürültü yaptığı için',
            'Pırıl’ın şapkası olduğu için',
          ],
          correctIndex: 0,
          hint: 'İpucu: Pamuk soruyu sormadan önce Pırıl’ın neyini fark etti?',
          explanation:
            'Aferin! Van kedilerinin gözleri farklı renkte olabilir; Pamuk bunu fark etti.',
        },
        {
          prompt: 'Pırıl ayrılırken arkadaşları için ne hissediyordu?',
          options: [
            'Onlara kızgındı',
            'Onlardan sıkılmıştı',
            'Onları seviyor ve onlara minnet duyuyordu',
          ],
          correctIndex: 2,
          hint: 'İpucu: Son paragrafta Pırıl’ın söylediği sözü oku.',
          explanation:
            'Harika! Pırıl arkadaşlarına teşekkür etti ve onları hiç unutmayacağını söyledi.',
        },
      ],
      glossary: [
        { word: 'kehribar', meaning: 'Bal gibi sarı ile turuncu arası bir renk.' },
        { word: 'Memleketim', meaning: 'Doğup büyüdüğüm yer.' },
        { word: 'tavsiyeler', meaning: 'Birine yardımcı olmak için verilen öğütler, öneriler.' },
      ],
    }),
    chest(city, 10, 'İstanbul’un son sandığını aç, lokumlarını topla ve İzmir’e yelken aç!'),
  ],
};
