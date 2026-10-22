(() => {
    const translations = new Map(Object.entries({
        "Tecnología": "Technology",
        "Accesorios": "Accessories",
        "Fotografía": "Photography",
        "Categoría": "Category",
        "Todos": "All",
        "Buscar en URPOnline": "Search URPOnline",
        "Buscar": "Search",
        "Carrito": "Cart",
        "☰ Todo": "☰ All",
        "Volver arriba": "Back to top",
        "E-commerce de laboratorio · AWS VPC/DMZ · ASP.NET Core MVC": "Educational e-commerce · AWS VPC/DMZ · ASP.NET Core MVC",
        "Servido por:": "Served by:",
        "Tecnología y accesorios": "Technology and accessories",
        "para tu día a día": "for your everyday life",
        "Explora el catálogo de URPOnline y arma tu carrito en minutos.": "Explore the URPOnline catalog and fill your cart in minutes.",
        "Ver más en": "Shop more in",
        "Productos destacados": "Featured products",
        "productos": "products",
        " resultados": " results",
        " resultados para ": " results for ",
        " en ": " in ",
        "Ordenar por:": "Sort by:",
        "Aplicar": "Apply",
        "Destacados": "Featured",
        "Precio: de menor a mayor": "Price: low to high",
        "Precio: de mayor a menor": "Price: high to low",
        "Nombre: A-Z": "Name: A-Z",
        "Todas": "All",
        "Precio": "Price",
        "Hasta S/ 300": "Up to S/ 300",
        "S/ 300 a S/ 800": "S/ 300 to S/ 800",
        "S/ 800 a S/ 1,500": "S/ 800 to S/ 1,500",
        "Más de S/ 1,500": "Over S/ 1,500",
        "‹ Cualquier precio": "‹ Any price",
        "Disponibilidad": "Availability",
        "Solo en stock": "In stock only",
        "Resultados": "Results",
        "No encontramos productos": "No products found",
        "Prueba con otra palabra, quita filtros o revisa la ortografía.": "Try another search term, remove filters, or check the spelling.",
        "Ver todo el catálogo": "View the full catalog",
        "Productos relacionados": "Related products",
        "búsqueda semántica con pgvector": "semantic search with pgvector",
        "Búsqueda semántica desactivada:": "Semantic search is unavailable:",
        "Similitud coseno entre tu búsqueda y el producto (pgvector)": "Cosine similarity between your search and the product (pgvector)",
        "Similitud semántica:": "Semantic similarity:",
        "No disponible por el momento": "Currently unavailable",
        "Solo quedan": "Only",
        "en stock": "left in stock",
        "En stock": "In stock",
        "Agregar al carrito": "Add to cart",
        "Tu carrito de URPOnline está vacío": "Your URPOnline cart is empty",
        "Revisa el catálogo y agrega productos.": "Browse the catalog and add products.",
        "Seguir comprando": "Continue shopping",
        "Carrito": "Cart",
        "Precio": "Price",
        "No disponible": "Unavailable",
        "Cantidad:": "Quantity:",
        "Eliminar": "Remove",
        "Subtotal (": "Subtotal (",
        " producto(s)):": " item(s)):",
        "Proceder al pago": "Proceed to checkout",
        "Finalizar compra": "Checkout",
        "Datos de entrega": "Delivery details",
        "Nombre completo": "Full name",
        "Correo electrónico": "Email address",
        "Dirección de entrega": "Delivery address",
        "La orden se crea como pendiente de pago. No se cobra dinero real.": "The order is created as pending payment. No real payment is charged.",
        "Confirmar pedido": "Place order",
        "Resumen del pedido": "Order summary",
        "Total del pedido:": "Order total:",
        "Si hay una promoción activa, el descuento se calcula en el servidor al confirmar.": "If a promotion is active, the discount is calculated on the server when you place the order.",
        "Pedido registrado, ¡gracias!": "Order placed, thank you!",
        "Tu pedido": "Your order",
        " quedó registrado en PostgreSQL con estado ": " was recorded in PostgreSQL with status ",
        "Esta aplicación es un laboratorio educativo: no procesa pagos reales.": "This application is an educational lab: it does not process real payments.",
        "Ocurrió un error": "An error occurred",
        "Intenta nuevamente. Si el problema persiste, comunícate con soporte.": "Please try again. If the problem persists, contact support.",
        "Volver a la tienda": "Back to the store",
        "Dashboard comercial · URPOnline": "Business dashboard · URPOnline",
        "Ventana:": "Window:",
        " días · Una orden solo cuenta como ingreso cuando está PAGADO.": " days · An order counts as revenue only when PAID.",
        "Visitas": "Visits",
        "Adiciones al carrito": "Cart additions",
        "Pedidos creados": "Orders created",
        "Órdenes pagadas": "Paid orders",
        "Ingreso confirmado": "Confirmed revenue",
        "Conversión indicativa": "Indicative conversion",
        "Órdenes pagadas por fecha": "Paid orders by date",
        "Fecha UTC": "UTC date",
        "Órdenes": "Orders",
        "Ingresos": "Revenue",
        "El conteo de visitas representa eventos, no usuarios únicos deduplicados.": "The visit count represents events, not deduplicated unique users.",
        "Promociones en tiempo real": "Real-time promotions",
        "Código": "Code",
        "Descuento %": "Discount %",
        "Inicio UTC": "UTC start",
        "Fin UTC": "UTC end",
        "Activo": "Active",
        "Guardar": "Save",
        "Activar/desactivar": "Enable/disable",
        "Nombre": "Name"
    }));
    const attributes = ["aria-label", "placeholder", "title"];
    const textPattern = new RegExp(
        [...translations.keys()]
            .sort((left, right) => right.length - left.length)
            .map(value => value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"))
            .join("|"),
        "g"
    );
    const originalText = new WeakMap();
    const originalAttributes = new WeakMap();
    const button = document.getElementById("language-toggle");
    let language = localStorage.getItem("urponline-language") === "en" ? "en" : "es";

    function translateValue(value) {
        return value
            .replace(textPattern, phrase => translations.get(phrase))
            .replace(/^(\d+)\s+a\s+(\d+)\s+de\s+(\d+)\s+results(\s+for\s+)?$/, (_, first, last, total, query = "") =>
                `${first} to ${last} of ${total} results${query}`);
    }

    function applyToElement(element) {
        if (element.nodeType === Node.TEXT_NODE) {
            if (!originalText.has(element)) {
                originalText.set(element, element.nodeValue);
            }
            const original = originalText.get(element);
            element.nodeValue = language === "en" ? translateValue(original) : original;
            return;
        }

        if (element.nodeType !== Node.ELEMENT_NODE) {
            return;
        }

        for (const attribute of attributes) {
            if (!element.hasAttribute(attribute)) {
                continue;
            }
            let originals = originalAttributes.get(element);
            if (!originals) {
                originals = new Map();
                originalAttributes.set(element, originals);
            }
            if (!originals.has(attribute)) {
                originals.set(attribute, element.getAttribute(attribute));
            }
            const original = originals.get(attribute);
            element.setAttribute(attribute, language === "en" ? translateValue(original) : original);
        }

        const walker = document.createTreeWalker(element, NodeFilter.SHOW_TEXT);
        let textNode;
        while ((textNode = walker.nextNode())) {
            applyToElement(textNode);
        }
    }

    function setLanguage(nextLanguage) {
        language = nextLanguage;
        localStorage.setItem("urponline-language", language);
        document.documentElement.lang = language;
        applyToElement(document.documentElement);
        button.textContent = language === "en" ? "ES" : "EN";
        const label = language === "en" ? "Switch language to Spanish" : "Switch language to English";
        button.setAttribute("aria-label", label);
        button.title = label;
        button.setAttribute("aria-pressed", language === "en" ? "true" : "false");
    }

    button.addEventListener("click", () => setLanguage(language === "en" ? "es" : "en"));
    setLanguage(language);

    new MutationObserver(records => {
        for (const record of records) {
            for (const node of record.addedNodes) {
                applyToElement(node);
            }
        }
    }).observe(document.body, { childList: true, subtree: true });
})();
