import React, { useState } from "react";
import "./style.css";

const AddProduct = () => {
  const [name, setProductName] = useState("");
  const [avatar, setAvatar] = useState("");
  const [price, setPrice] = useState("");
  const [category, setCategory] = useState("");
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const MIN_WIDTH = 200;
  const MIN_HEIGHT = 200;

  const validateImageSize = (url) => {
    return new Promise((resolve, reject) => {
      const img = new Image();
      img.onload = function () {
        if (this.width >= MIN_WIDTH && this.height >= MIN_HEIGHT) {
          resolve(true);
        } else {
          reject(`Сүрөт өтө кичинекей. Кеминде ${MIN_WIDTH}x${MIN_HEIGHT}px болушу керек.`);
        }
      };
      img.onerror = () => reject("Сүрөт жүктөлбөй калды. URL туурабы?");
      img.src = url;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage("");
    setError("");

    if (!name || !avatar || !price || !category) {
      setError("Бардык талааларды толтуруу милдеттүү!");
      return;
    }

    try {
      await validateImageSize(avatar);
    } catch (errMsg) {
      setError(errMsg);
      return;
    }

    const productData = {
      name,
      avatar,
      price,
      category,
      id: Date.now().toString(),
    };

    try {
      const response = await fetch(
        "https://66dfd7322fb67ac16f2740dd.mockapi.io/product",
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(productData),
        }
      );

      if (response.ok) {
        setMessage("✅ Продукт ийгиликтүү кошулду!");
        setTimeout(() => setMessage(""), 3000);
        window.location.href = "/productlist";
      } else {
        setError("❌ Продукт кошууда ката кетти!");
      }
    } catch (error) {
      setError("❌ Сервердеги ката же тармак маселеси.");
    }
  };

  return (
    <div className="form-container">
      <form className="add-product-form" onSubmit={handleSubmit}>
        <h2>Жаңы продукт кошуу</h2>
        <input
          type="text"
          placeholder="Продукт аты"
          value={name}
          onChange={(e) => setProductName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Сүрөттүн URL"
          value={avatar}
          onChange={(e) => setAvatar(e.target.value)}
        />
        <input
          type="number"
          placeholder="Баасы (сом)"
          value={price}
          onChange={(e) => setPrice(e.target.value)}
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
        >
          <option value="">Категорияны тандаңыз</option>
          <option value="nike">компонент1 nike</option>
          <option value="puma">компонент2 puma</option>
          <option value="jordan">компонент3 jordan</option>
          <option value="lining">компонент4 lining</option>
        </select>
        <button type="submit">➕ Кошуу</button>
        {message && <p className="success-message">{message}</p>}
        {error && <p className="error-message">{error}</p>}
      </form>
    </div>
  );
};

export default AddProduct;
