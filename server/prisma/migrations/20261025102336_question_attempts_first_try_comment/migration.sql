-- "İlk deneme" artık okuma oturumundan bağımsız: dersin ilk tamamlanışından önce soruya verilen ilk
-- cevap. Tablo açıklaması güncellenir.
COMMENT ON TABLE "question_attempts" IS 'Bir soruya verilen tek bir cevap. Şıkka her dokunuş bir satırdır. Yıldız ve lokum, dersin ilk tamamlanışından önce kullanıcının soruya (hangi okumada olursa olsun) verdiği ilk cevabın doğru olup olmadığına göre hesaplanır; tekrar oynamada yıldız yalnızca o okumanın ilk cevaplarına bakar.';
