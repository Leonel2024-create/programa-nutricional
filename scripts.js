(function() {
    emailjs.init('user_cqptifbNjKSLfG7eu');
})();

document.getElementById('nutritionForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const name = document.getElementById('name').value;
    const surname = document.getElementById('surname').value;
    const email = document.getElementById('email').value;
    const age = document.getElementById('age').value;
    const height = document.getElementById('height').value;
    const weight = document.getElementById('weight').value;
    let condition = document.getElementById('condition').value;
    const otherCondition = document.getElementById('otherCondition').value;

    if (condition === 'Otro') {
        condition = otherCondition;
    }

    const plan = generateNutritionPlan(name, surname, age, height, weight, condition);
    generatePDF(plan, name, surname);
    sendEmail(name, surname, email, age, height, weight, condition, plan);
});

function generateNutritionPlan(name, surname, age, height, weight, condition) {
    const breakfastOptions = ['Opción 1: Yogur con frutas', 'Opción 2: Tostadas integrales con aguacate', 'Opción 3: Avena con leche y miel', 'Opción 4: Batido de proteínas', 'Opción 5: Huevos revueltos con espinacas'];
    const lunchOptions = ['Opción 1: Ensalada de quinoa', 'Opción 2: Pollo a la parrilla con verduras', 'Opción 3: Pescado al horno con arroz integral', 'Opción 4: Sopa de lentejas', 'Opción 5: Tacos de pavo'];
    const snackOptions = ['Opción 1: Fruta fresca', 'Opción 2: Nueces y almendras', 'Opción 3: Palitos de zanahoria con hummus', 'Opción 4: Batido de frutas', 'Opción 5: Yogur griego'];
    const dinnerOptions = ['Opción 1: Sopa de pollo', 'Opción 2: Ensalada de atún', 'Opción 3: Filete de ternera con brócoli', 'Opción 4: Omelette de champiñones', 'Opción 5: Pizza casera de verduras'];
    const collationsOptions = ['Opción 1: Galletas integrales', 'Opción 2: Barrita de cereal', 'Opción 3: Frutos secos', 'Opción 4: Fruta deshidratada', 'Opción 5: Yogur con granola'];

    let planText = `Plan de Nutrición para ${name} ${surname}\n`;
    planText += `Edad: ${age}\nAltura: ${height} cm\nPeso: ${weight} kg\nCondición Médica: ${condition}\n\n`;
    planText += `Desayuno:\n${breakfastOptions.join('\n')}\n\n`;
    planText += `Almuerzo:\n${lunchOptions.join('\n')}\n\n`;
    planText += `Merienda:\n${snackOptions.join('\n')}\n\n`;
    planText += `Cena:\n${dinnerOptions.join('\n')}\n\n`;
    planText += `Colaciones:\n${collationsOptions.join('\n')}\n\n`;

    return planText;
}

function generatePDF(plan, name, surname) {
    const docDefinition = {
        content: [
            { text: `Plan de Nutrición para ${name} ${surname}`, style: 'header' },
            { text: '\n\n' },
            { text: 'Detalles del Plan:', style: 'subheader' },
            { text: '\n' },
            { text: plan, style: 'planContent' }
        ],
        styles: {
            header: {
                fontSize: 18,
                bold: true,
                alignment: 'center',
                margin: [0, 0, 0, 20]
            },
            subheader: {
                fontSize: 14,
                bold: true,
                margin: [0, 10, 0, 5]
            },
            planContent: {
                fontSize: 12,
                margin: [0, 0, 0, 10]
            }
        }
    };

    pdfMake.createPdf(docDefinition).getBlob((blob) => {
        const url = URL.createObjectURL(blob);
        const downloadLink = document.getElementById('downloadLink');
        downloadLink.href = url;
        downloadLink.download = `Plan_Nutricion_${name}_${surname}.pdf`;
        downloadLink.style.display = 'block';
        downloadLink.textContent = 'Descargar Plan de Nutrición';
    });
}

function sendEmail(name, surname, email, age, height, weight, condition, plan) {
    const templateParams = {
        from_name: 'Equipo de Nutrición',
        to_name: `${name} ${surname}`,
        email: email,
        age: age,
        height: height,
        weight: weight,
        condition: condition,
        plan: plan
    };

    emailjs.send('service_gg1ed4x', 'template_qa53al5', templateParams)
        .then(function(response) {
            console.log('SUCCESS!', response.status, response.text);
        }, function(error) {
            console.log('FAILED...', error);
        });
}

function toggleOtherCondition() {
    const conditionSelect = document.getElementById('condition');
    const otherConditionInput = document.getElementById('otherCondition');
    if (conditionSelect.value === 'Otro') {
        otherConditionInput.style.display = 'block';
    } else {
        otherConditionInput.style.display = 'none';
    }
}