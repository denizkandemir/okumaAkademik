import { quote, reason, type CityNotes } from './types.js';

export const izmirNotes: CityNotes = {
  reviewPoints: [
    '**G1 cümle uzunluğu:** Hedefimiz çoğunlukla 5-8 kelimelik cümlelerdi; sürümlerin ortalaması 4,44-6,79 kelime. Cümleler size fazla kesik geliyorsa işaretleyebilirsiniz; bu metinlerin çoğunda Ateşman puanı cümleleri biraz uzatmaya izin veriyor.',
    '**Metne eklenen bilgiler:** G2’de olmayan şu bilgiler eklendi: Saat Kulesi’nin yüz yılı aşkın süredir İzmir’in simgelerinden ve buluşma noktalarından biri olduğu (G3, G4), kulenin dibinde çeşmeler bulunduğu (G4), Kordon’un körfez boyunca uzandığı ve palmiyeli olduğu (G3, G4), Kemeraltı Çarşısı’nın yüzlerce yıllık olduğu (G3, G4), çarşıda bakır kaplar satıldığı (G3), Efes’in İzmir’den pek uzak olmadığı (G3), vapur Konak’tan ayrılırken Saat Kulesi’nin göründüğü (G4). Doğruluklarını da kontrol etmenizi rica ederiz.',
    '**Hikâyeye eklenen ayrıntılar:** Olaylar aynı kalsa da G3 ve G4’te küçük betimlemeler eklendi: Elif’in kalabalıkta düşmekten utanması, uçurtmanın renkli kurdeleleri, Kemeraltı’nda çekiç tıkırtıları, Pırıl’ın birkaç gündür yeni durağını düşünmesi gibi. Hikâyeyi değiştirdiğini düşündüğünüz yerleri işaretleyebilirsiniz.',
    '**“Boyoz”la ilgili anlatımlar:** Metinlerde boyozun İzmir’de genellikle haşlanmış yumurta ve çayla yendiği, G4’te ayrıca “bize özgü” olduğu söyleniyor; uygun bulmadığınız ifadeyi işaretleyebilirsiniz.',
    '**Mecazlar (G4):** “merakı uykusuna galip geldi”, “asıl acıyan gururuydu”, “İzmir sanki nefesini tutmuştu”, “burnu onu yarı yolda bıraktı”, “görünmez bir zincirle”, “başka bir zamanın kapısını aralamıştı” gibi anlatımlar 7-8. sınıf için seçildi; ağır bulduklarınızı işaretleyebilirsiniz.',
  ],
  evidence: {
    'saat-kulesinin-guvercinleri-g1': [
      quote('Can yemi yere serpince kuşlar pır pır uçup geldi.'),
      quote('Kulenin dört yüzünde de birer saat duruyordu.'),
      quote('Can biraz düşündü, sonra sevinçle bağırdı'),
    ],
    'saat-kulesinin-guvercinleri-g3': [
      quote('Birden yüzü aydınlandı ve sevinçle “Saat üç!” diye bağırdı.'),
      reason(
        'Dede cevabı bildiği hâlde söylemez, “Sen söyle bakalım,” deyip ipucu verir; demek ki Can’ın kendisinin bulmasını ister.',
      ),
      quote(
        'Can o gün yalnızca güvercinleri beslememiş, kendi başına yeni bir şey öğrenmenin sevincini de tatmıştı.',
      ),
    ],
    'saat-kulesinin-guvercinleri-g4': [
      reason(
        'Son cümlede Can’ın asıl kazancı anlatılır: Merak ettiği bir soruyu kendi başına çözebileceğini keşfetmesi.',
      ),
      reason(
        'Dede cevabı bildiği hâlde söylemez, yalnızca ipucu verir; balık tutmayı öğreten usta benzetmesi de bunu anlatır.',
      ),
      quote('Kısa kol saati, uzun kol dakikayı gösteriyordu'),
    ],
    'boyoz-sabahi-g1': [
      reason(
        'Defne ısırık alınca boyozun çıtır çıtır olduğu söylenir; bu söz yenirken çıkan hafif sesi anlatır.',
      ),
      quote('“Çok güzel!” dedi Defne ve bir boyoz daha istedi.'),
      quote('Bu tadı o da bilsin istedi.'),
    ],
    'boyoz-sabahi-g3': [
      reason(
        'Metin baştan sona Defne’nin İzmir’de tanıdığı boyozu anlatır; öbür başlıklar yalnızca küçük bir ayrıntıyı karşılar.',
      ),
      quote('İzmir’de boyozu genellikle haşlanmış yumurta ve çayla yeriz.'),
      quote(
        'Defne önce çekinerek küçük bir ısırık aldı, çünkü adını bile ilk kez duyduğu bir yiyecekti.',
      ),
    ],
    'boyoz-sabahi-g4': [
      reason(
        'Defne önce söylenir ama gülümsemeyi görünce merak eder ve kalkar; “galip gelmek” merakın uykudan güçlü çıktığını anlatır.',
      ),
      reason(
        'Yumurta ve çay, Defne’nin kuşkusu ve fırıncının selamı metinde geçer; boyozun yalnızca yazın yapıldığı hiçbir yerde söylenmez.',
      ),
      quote(
        'Konuşurken gözlerini işinden ayırmayan bu güler yüzlü adam, her müşterisine adıyla selam veriyordu.',
      ),
    ],
    'kordonda-bisiklet-g1': [
      quote('Dizi biraz acıdı, gözleri doldu.'),
      quote('Babası, “Gel, Kordon’da deneyelim,” dedi.'),
      reason(
        'Elif tek başına gidebildiğini görünce “Başardım!” diye bağırıyor; bu söz mutluluğu ve gururu gösterir.',
      ),
    ],
    'kordonda-bisiklet-g3': [
      quote('bu durum onu hem heyecanlandırıyor hem de biraz korkutuyordu.'),
      reason(
        'Elif düşer, babasının “Önemli olan yeniden denemek.” sözüyle yeniden biner ve sonunda tek başına gider.',
      ),
      reason(
        'Elif düştükten sonra dizinde hafif bir acı duyar; gözlerinin dolması da bunu destekler, dizi iyileşmemiş ya da üşümemiştir.',
      ),
    ],
    'kordonda-bisiklet-g4': [
      quote('Düşmenin bir son değil, yolun bir parçası olduğunu öğrenmişti.'),
      reason(
        'Elif’in en çok korktuğu şey herkesin önünde düşmekti; diz sızısından çok gururunun kırılmasına üzülür, yanakları da bu yüzden kızarır.',
      ),
      reason(
        'I doğru: “düşerse herkesin ona bakacağını fısıldıyordu.” II yanlış: babası onu yeniden denemeye yönlendirir. III doğru: “meğer onu çoktan bırakmıştı.”',
      ),
    ],
    'kemeraltinin-kokulari-g1': [
      quote('Üçüncüyü bilemedi. Amca, “Bu kekik,” dedi.'),
      quote('Annesi babaannesi için baharat alacaktı. Bir baharatçının önüne geldiler.'),
      reason(
        'Ali gözü kapalı kavanozları koklayıp tahmin etmeye çalıştı; burnunu çok kullandığı için böyle şaka yapıyor.',
      ),
    ],
    'kemeraltinin-kokulari-g3': [
      reason(
        'Ali kekiği baharatçıdan öğrenir (“Bu kekik. Dağlarda yetişir”); akşam aynı kokuyu yemekte tanır.',
      ),
      reason(
        'Ali gün boyu kavanozları koklayıp tahmin etti; burun gerçekten çalışmaz, bu cümle bir şakadır ve annesi de güler.',
      ),
      quote('Amca, “Bu kekik. Dağlarda yetişir,” dedi'),
    ],
    'kemeraltinin-kokulari-g4': [
      reason(
        'Kumaş ve oyuncak, kekiğin dağlarda yetişmesi, nane ve tarçını bilmesi metinde geçer; çarşının gece kapalı olduğu hiçbir yerde söylenmez.',
      ),
      quote(
        'Üçüncüsünde ise burnu onu yarı yolda bıraktı; bildiği kokulara benziyordu ama hiçbirinin tam karşılığı değildi.',
      ),
      reason(
        'Paragrafın ilk yarısı Ali’nin bildiği kokuları, “Üçüncüsünde ise” ile başlayan yarısı bilemediği kokuyu anlatır; “ise” sözü geçişi gösterir.',
      ),
    ],
    'ucurtma-ve-imbat-g1': [
      quote('Yeni uçurtmaları vardı ama hiç rüzgâr yoktu.'),
      reason('Çocuklar rüzgârın gelmesini kızmadan bekliyor; “sabırla” acele etmeden demektir.'),
      quote('Nehir sevinip zıpladı.'),
    ],
    'ucurtma-ve-imbat-g3': [
      quote('Acele ederek başaramadıkları şeyi beklemeyi öğrenince başarmışlardı.'),
      reason(
        'Rüzgâr esince yapraklar kıpırdar; yaprak bile kıpırdamıyorsa hiç rüzgâr yok demektir. Hemen sonra uçurtma da uçamaz.',
      ),
      quote('Mert önce inanmadı, çünkü hava çok durgundu.'),
    ],
    'ucurtma-ve-imbat-g4': [
      quote(
        'Öğleden sonra imbat eser. İmbat, denizden gelen serin bir rüzgârdır; İzmir’i yazın o serinletir.',
      ),
      quote(
        'O gün anladılar ki bazı işlerde koşmak yetmez; doğru rüzgârı beklemeyi de bilmek gerekir.',
      ),
      quote('Körfez bir ayna kadar durgundu, palmiyelerin yaprakları kımıldamıyordu.'),
    ],
    'tramvayda-bir-yer-g1': [
      quote('Ece hemen ayağa kalktı. “Buyurun amca, oturun,” dedi.'),
      reason(
        'Ece amcaya yerini verir ve amca bu davranış üzerine “kibar” der; kibar, nazik ve saygılı demektir.',
      ),
      quote('İçi sevinçle doldu.'),
    ],
    'tramvayda-bir-yer-g3': [
      reason(
        'Annesi hiçbir şey söylemez ve gülümser; Ece bunun ne anlama geldiğini bilip yerini verir. Kararı Ece’ye bırakmıştır.',
      ),
      quote('Sonra Ece’ye, torununun da onun yaşında olduğunu anlattı.'),
      reason(
        'Metnin merkezinde Ece’nin yerini vermesi ve bunun verdiği sevinç vardır; öbür başlıklar yalnızca bir ayrıntıyı karşılar.',
      ),
    ],
    'tramvayda-bir-yer-g4': [
      quote(
        'Birine verdiğin bir koltuk, sana yolculuktan daha uzun süren bir mutluluk olarak dönüyordu.',
      ),
      quote('Bacakları oturmak istiyor, vicdanı ise ayağa kalkmasını söylüyordu.'),
      reason(
        'I yanlış: “Annesi hiçbir şey söylemedi, yalnızca gülümsedi”. II doğru: bacakları ağrıdığı hâlde kalktı. III doğru: “eski dostlar gibi konuşuyordu.”',
      ),
    ],
    'kordonun-martisi-g1': [
      quote('Martının ayağına uzun bir misina dolanmıştı.'),
      quote('Küçük bir makasla misinayı kesti.'),
      quote('Zeynep sevinip el salladı.'),
    ],
    'kordonun-martisi-g3': [
      quote('çünkü küçük bir ipin bir canlıya neler yapabileceğini artık biliyordu.'),
      quote('Hem onu daha çok korkutabiliriz hem de yanlış tutabiliriz.'),
      reason(
        'Babası doğru yardım yolunu gösterir, Zeynep de sonunda misinaları toplamaya başlar; metin bu iki düşünceyi birleştirir.',
      ),
    ],
    'kordonun-martisi-g4': [
      reason(
        'Üçüncü paragraftaki “İyi niyet tek başına yetmiyordu, doğru yol da gerekiyordu” ile son cümledeki küçük ip düşüncesi birlikte bu yargıyı verir.',
      ),
      quote(
        'Yaklaştıkça zincirin ne olduğu anlaşıldı: Martının ayağına uzun bir misina dolanmıştı.',
      ),
      reason(
        'İkinci paragrafta misina fark edilir, dördüncü paragrafta balıkçı amcaya haber verilir, beşinci paragrafta martı uçar.',
      ),
    ],
    'pirilin-korfez-yolculugu-g1': [
      quote('“Bu kitap Efes’i anlatıyor,” dedi.'),
      quote('Pırıl hiç kıpırdamadan dinledi.'),
      reason(
        'Pırıl Efes’i kitaptan duyar, gözleri parlar ve hemen ardından kararını verir; demek ki kitap onu meraklandırmıştır.',
      ),
    ],
    'pirilin-korfez-yolculugu-g3': [
      quote('Merakını yenemedi, usulca bankın üstüne çıktı ve kitaba doğru eğildi.'),
      quote('Günlerdir aradığı cevabı küçük bir kızın kitabında bulmuştu'),
      reason(
        'Pırıl’ın yeni durağını küçük bir kızın kitabı belirler; metin bir kitabın merak uyandırıp yolculuğa götürmesini anlatır.',
      ),
    ],
    'pirilin-korfez-yolculugu-g4': [
      quote(
        'Günlerdir aradığı cevap, hiç beklemediği bir anda, küçük bir kızın elindeki kitaptan çıkıvermişti.',
      ),
      quote(
        'Sütunların arasında yürüyen insanları, taş yollarda yankılanan ayak seslerini gözünün önüne getirdi.',
      ),
      reason(
        'Dördüncü paragraf Pırıl’ın Efes’i hayal etmesiyle biter; yalnızca bu cümle aynı konuyu sürdürür, öbürleri konudan kopar.',
      ),
    ],
  },
};
