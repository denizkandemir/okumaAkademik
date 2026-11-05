import { quote, reason, type CityNotes } from './types.js';

export const istanbulNotes: CityNotes = {
  reviewPoints: [
    '**G1 cümle uzunluğu:** Hedefimiz çoğunlukla 5-8 kelimelik cümlelerdi; ancak Türkçe sözcükler hece bakımından uzun olduğu için Ateşman 85 ve üstünde kalmak ortalamayı 3,6-4,4 kelimeye indirdi. Cümleler size fazla kesik geliyorsa, hedef aralığı mı yoksa cümleleri mi gevşetelim, sizin görüşünüz belirleyici olacak.',
    '**Metne eklenen bilgiler:** G2’de olmayan şu bilgiler eklendi: Kız Kulesi’nin eskiden gemilere yol gösteren bir fener olarak kullanıldığı (G3, G4), Kapalıçarşı ve Galata Kulesi’nin yüzlerce yıllık olduğu (G3, G4), Kapalıçarşı’nın kubbeli olduğu ve Eminönü’ne yaklaşırken minare ve kubbelerin göründüğü (G4), Boğaz Köprüsü’nde çelik halatlar bulunduğu (G4). Doğruluklarını da kontrol etmenizi rica ederiz.',
    '**Mecazlar (G4):** “gün ile gecenin el sıkıştığı”, “renkten bir gerdanlık”, “yüreğine su serpti” gibi anlatımlar 7-8. sınıf için seçildi; ağır bulduklarınızı işaretleyebilirsiniz.',
  ],
  evidence: {
    'vapurda-simit-g1': [
      quote('Dedesi iki sıcak simit almıştı.'),
      quote(
        'Ece simitten küçük bir parça kopardı. Elini havaya uzattı. Bir martı geldi, parçayı kaptı.',
      ),
      quote('Ece önce şaşırdı. Sonra güldü de güldü.'),
    ],
    'vapurda-simit-g3': [
      quote('Bir martı ok gibi geldi, parçayı kaptı ve gözden kayboldu.'),
      quote(
        'Bir martı ok gibi geldi, parçayı kaptı ve gözden kayboldu. Ece önce ne olduğunu anlayamadı, sonra kahkahalarla gülmeye başladı.',
      ),
      reason(
        'Metin, simit paylaşmanın getirdiği neşeyi anlatır; son cümle bunu özetler: “Küçük bir simit parçası, o sabahı ikisi için de unutulmaz yapmıştı.”',
      ),
    ],
    'vapurda-simit-g4': [
      reason(
        'Son paragrafta dede, paylaşılan bir simidin bir fırın dolusu ekmekten daha çok mutluluk verebildiğini düşünür; bütün olaylar bu düşünceye bağlanır.',
      ),
      reason(
        'İpe bağlı bir şey sahibinden ayrılamaz; “Çok geçmeden martılar vapurun peşine takıldı.” cümlesiyle birlikte martıların vapuru bırakmadığı anlaşılır.',
      ),
      reason(
        'I doğru (“Burası ona göre vapurun en güzel köşesiydi”). II yanlış: simit Kadıköy İskelesi’nde alınır. III doğru (“Şaşkınlıkla birkaç saniye donup kalan Ece”).',
      ),
    ],
    'bahcedeki-domatesler-g1': [
      reason(
        'Elif’in fideleri dikip her gün sulaması ve yaza kadar beklemesi “emek”in bir iş için harcanan çaba olduğunu gösterir.',
      ),
      quote('Dedesi, “Bitki suyu da güneşi de sever,” dedi.'),
      quote('Elif ilk domatesi kopardı. Çok heyecanlandı.'),
    ],
    'bahcedeki-domatesler-g3': [
      quote('İlk günlerde hiçbir değişiklik göremeyince Elif biraz sabırsızlandı'),
      reason(
        'Dede bu sözü fideler henüz değişmemişken söyler; birkaç hafta sonra fideler uzar. Söz, büyümenin zaman istediğini anlatır.',
      ),
      reason(
        'Metin, uzun bekleyişin sonunda kızaran domatesleri anlatır; dede “İşte bu, senin sabrının meyvesi,” der. Bu nedenle başlık “Sabrın Kırmızı Meyvesi” olur.',
      ),
    ],
    'bahcedeki-domatesler-g4': [
      reason(
        'Aylarca süren emek ve bekleyişin sonunda Elif “Emeğimizin tadı başka!” der; metnin bütünü bu düşünceye varır.',
      ),
      reason(
        'Kupa, kazanılınca gururla taşınır; Elif de yetiştirdiği domatesi iki eliyle tutup bir kupa gibi dedesine götürür.',
      ),
      quote('Bir süre sonra çiçeklerin yerinde yeşil boncukları andıran domatesler belirdi.'),
    ],
    'minik-serce-g1': [
      quote('Pıtır her sabah şarkı söylerdi.'),
      quote(
        'Bir gün çok güçlü bir rüzgâr esti. Ağacın dalları sallandı. Pıtır’ın yuvası yere düştü.',
      ),
      quote('Pıtır’ın yuvası yere düştü. Pıtır çok üzüldü.'),
    ],
    'minik-serce-g3': [
      quote('Şarkısını duymayan arkadaşları ise bir şey olduğunu hemen anladı ve yardıma geldi.'),
      quote(
        'Komşu kuşlar onun sesini çok sever, bahçeye gelen çocuklar bile oyunlarını bırakıp onu dinlerdi.',
      ),
      reason(
        'Pıtır yuvayı tek başına yapamaz, arkadaşlarıyla akşam olmadan bitirir; son bölümdeki “Birlikte olunca her şey kolaylaşıyor” düşüncesi bunu özetler.',
      ),
    ],
    'minik-serce-g4': [
      reason(
        'Metin, rüzgârın yuvayı alıp Pıtır’a asıl barınağının dostları olduğunu göstermesini anlatır; son cümle de bu düşünceyle biter.',
      ),
      reason(
        'Pıtır’ın sesi kesilince “Çok geçmeden arkadaşları çevresini sardı.” Yani sessizliği arkadaşlarının dikkatini hemen çekmiştir.',
      ),
      reason(
        'I yanlış: “Hiçbiri uzun uzun teselli cümleleri kurmadı”; dal ve tüy getirdiler. II doğru: “Bahçeyi her sabah dolduran ses, o an boğazında düğümlendi.” III doğru: hep birlikte yuva yaptılar.',
      ),
    ],
    'kiz-kulesinin-isiklari-g1': [
      quote('Küçük bir adada durur'),
      reason(
        'Işıkların suda hafifçe kıpırdayıp parladığı anlatılıyor; ışıklar sönmüyor, Mert onlara uzun uzun bakıyor.',
      ),
      reason(
        'Bir resmi duvara asmak, onu sevip her gün görmek istemektir; anneanne de Mert’in verdiği resmi duvara asıyor.',
      ),
    ],
    'kiz-kulesinin-isiklari-g3': [
      quote('Eskiden gemilere yol göstermek için de kullanılmış.'),
      reason(
        'Kule gerçekten konuşmaz; “sanki” sözü, güneş batarken yanan ışıkların geceye selam verir gibi göründüğünü anlatır.',
      ),
      reason(
        'Metinde doğrudan söylenmez; ama resimde o akşam gördüklerini çizer ve “güzel akşamı” hatırlar, bu da akşamı çok sevdiğini gösterir.',
      ),
    ],
    'kiz-kulesinin-isiklari-g4': [
      reason(
        'Ada, fener ve teknelerden söz edilir; kuleyi kimin yaptırdığı metnin hiçbir yerinde geçmez.',
      ),
      quote('sorusunun cevabını öğrenmişti, ama merakı yatışacağına büyümüştü.'),
      reason(
        'Paragraflar sırayla sahil yürüyüşünü, soru ve cevabı, ışıkların yanmasını ve evde çizilen resmi anlatır.',
      ),
    ],
    'galatadan-bakinca-g1': [
      quote('Asansörle yukarı çıktılar.'),
      reason(
        '“Uçuşturdu” havada savrulmak demektir; balkondaki rüzgârın saçlara yaptığı da budur.',
      ),
      quote('“Kendimi kuş gibi hissediyorum!” dedi.'),
    ],
    'galatadan-bakinca-g3': [
      quote('sayı ilerledikçe yeni vapurlar çıkıyor, sayım bir türlü bitmiyordu.'),
      reason(
        'Deniz aşağı inerken kuleden gördüklerini düşünmeyi sürdürür; hemen ardından yine gelmeye karar verir.',
      ),
      reason(
        'Metnin özünde Deniz’in şehri kuşların gördüğü gibi görmesi vardır: “Kuşlar da şehri hep böyle görüyor.”',
      ),
    ],
    'galatadan-bakinca-g4': [
      quote('Demek ki aynı şehir, bakılan yere göre bambaşka bir yer olabiliyordu.'),
      reason(
        'Taş duvarların yüzyılların rüzgârına “göğüs germesi”, kulenin çok uzun zamandır ayakta kaldığını anlatır.',
      ),
      reason(
        'Üçüncü paragraf, kuleden görünen uzak manzarayı anlatır (“Aşağıda İstanbul, ucu bucağı görünmeyen bir harita gibi serilmişti.”); uzaktaki tepeler ancak buraya uyar.',
      ),
    ],
    'kapalicarsida-bir-gun-g1': [
      quote('Babaanneye hediye alacaklardı.'),
      quote('Sonra annesinin sözü aklına geldi. Lambacının önünde durdu ve bekledi.'),
      quote('Annesi yanında yoktu!'),
    ],
    'kapalicarsida-bir-gun-g3': [
      reason(
        '“Aklına yazmak” deyim olarak iyice bellemek demektir; Zeynep sonra bu sözü gerçekten hatırlar: “sonra annesinin sözünü hatırladı.”',
      ),
      quote('Bekleyiş ona çok uzun geldi, ama yerinden ayrılmadı.'),
      reason(
        'Zeynep paniğe kapılmayıp annesinin öğüdünü izler ve kısa sürede bulunur; annesi de “tam söylediğim gibi yaptın” der.',
      ),
    ],
    'kapalicarsida-bir-gun-g4': [
      quote('Lambacı amcanın gülümsemesi de yüreğine su serpti.'),
      reason(
        'I doğru: “sıradan bir öğüt gözüyle bakmıştı.” II yanlış: koşmak yalnızca “geçti içinden”, lambacının önünde bekledi. III doğru: öğüdü hatırlayınca durup bekledi.',
      ),
      quote('telaşa kapılmadan düşünmenin değerini de hatırlatacaktı.'),
    ],
    'iki-yakayi-baglayan-kopru-g1': [
      reason(
        'Ali’nin ailesi teyzeye gitmek için köprüyle karşıya geçiyor; “öbür yaka” şehrin diğer tarafıdır.',
      ),
      quote('Işıklar bir mor, bir mavi oluyordu.'),
      quote('“Biz şimdi Asya’dan Avrupa’ya geçiyoruz.” Ali çok şaşırdı.'),
    ],
    'iki-yakayi-baglayan-kopru-g3': [
      quote('Biz şimdi Asya’dan Avrupa’ya geçiyoruz'),
      quote(
        'Ali çok şaşırdı, çünkü o zamana kadar kıtaların birbirinden çok uzak olduğunu sanıyordu.',
      ),
      quote(
        'Eskiden teyzesinin evi ona çok uzak gelirdi, ama bugün o uzaklık bir köprü kadar kısalmıştı.',
      ),
    ],
    'iki-yakayi-baglayan-kopru-g4': [
      reason(
        'Kıtalar, ışıkların rengi ve küçük görünen gemiler metinde geçer; köprünün ne zaman yapıldığı hiç söylenmez.',
      ),
      reason(
        '“Gibi” sözüyle deniz kurdeleye benzetilir; “parlak” ve “uzanıyordu” sözleri benzetmenin parlaklık ve biçim yönünden yapıldığını gösterir.',
      ),
      reason(
        'Teyzeye giderken Asya’dan Avrupa’ya geçtiklerine göre varılan yer Avrupa yakasıdır: “Biz şimdi Asya’dan Avrupa’ya geçiyoruz”.',
      ),
    ],
    'pirilin-istanbul-arkadaslari-g1': [
      quote('Önce İzmir’e uğrayacağım'),
      quote('“Bir gözün mavi, öbürü bal rengi. Nerelisin sen?”'),
      reason(
        'Pırıl Van’a dönerken İzmir’de kısa bir mola verecek; “uğramak” yol üstünde gidip kısa süre kalmaktır.',
      ),
    ],
    'pirilin-istanbul-arkadaslari-g3': [
      quote(
        'Pırıl ise yolun uzun olmasından şikâyetçi değildi, çünkü her şehirde yeni dostlar buluyordu.',
      ),
      reason(
        'Duman’ın küçük bir tüyü çekinerek getirmesi “utangaç”ın çekinen, sıkılgan demek olduğunu gösterir.',
      ),
      reason(
        'Pırıl yolculuğunda yeni dostlar bulur, onlardan armağan ve tavsiye alır; metin baştan sona bu dostluğu anlatır.',
      ),
    ],
    'pirilin-istanbul-arkadaslari-g4': [
      reason(
        'Kediler önce uzaktan bakar, sonra yaklaşır; yani merak etmeleri çekinmelerinden daha güçlü gelmiştir.',
      ),
      reason(
        'Metnin doruğu, Duman’ın sahip olduğu tek şeyi armağan etmesidir: “Belki de parkın en kıymetli hazinesiydi bu”.',
      ),
      quote('Yine de her biri, yolcuya verecek bir şey buldu.'),
    ],
  },
};
