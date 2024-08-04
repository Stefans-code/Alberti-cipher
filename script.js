let digraphs = {
  'H': 'FF',
  'J': 'II',
  'K': 'QQ',
  'U': 'VV',
  'W': 'XX',
  'Y': 'ZZ'
};
let stabilis = 'ABCDEFGILMNOPQRSTVXZ1234'.split('');
let mobilis = 'klnprtuz&xysomqihfdbaceg'.split('');

$('#encipher').click(function(){
  let plaintext = $('#input-text').val();
  let encryptionMethod = $("input[name='encryption-method']:checked").val();

  if (encryptionMethod === 'Method 1') {
    encryptMethod1(plaintext, stabilis, mobilis, digraphs);
  } else if (encryptionMethod === 'Method 2') {
    encryptMethod2(plaintext, stabilis, mobilis, digraphs);
  }
});



Array.prototype.rotate = function(n) {
  var len = this.length;
  return !(n % len) ? this.slice()
      : this.map((e,i,a) => a[(i + (len + n % len)) % len]);
};

let paintCipherDisk = function(stabilis, mobilis){
  if(stabilis.length !== mobilis.length){
    alert('stabilis and mobilis must be of equal length');
    return;
  }
  $('.stabilis li, .mobilis li').remove();
  stabilis.forEach(function(a){
    $('.stabilis').append(`<li><span>${a}</span></li>`);
  });
  mobilis.forEach(function(a){
    $('.mobilis').append(`<li><span>${a}</span></li>`);
  });

  let rotationDelta = 360/$('.stabilis li').length;
  for(var i = 0; i<mobilis.length; i++){
    let rotation = rotationDelta*i;
    $($('.stabilis li')[i]).css('transform', `rotate(${rotation}deg) skewY(-60deg)`);
    $($('.mobilis li')[i]).css('transform', `rotate(${rotation}deg) skewY(-60deg)`);
  }
  $('.stabilis li span, .mobilis li span').css('transform', `skewY(60deg) rotate(${rotationDelta/2}deg)`);
};

let updateStartSelectors = function(stabilis, mobilis){
  $('#stabilis-start option, #mobilis-start option').remove();
  stabilis.forEach(function(a){
    $('#stabilis-start').append(`<option>${a}</option>`);
  });
  mobilis.forEach(function(a){
    $('#mobilis-start').append(`<option>${a}</option>`);
  });
};

paintCipherDisk(stabilis, mobilis);
updateStartSelectors(stabilis, mobilis);

$('#stabilis-start').on('change', function(){
  let stabilisNewIndex = stabilis.indexOf(this.value);
  stabilis = stabilis.rotate(stabilisNewIndex);
  paintCipherDisk(stabilis,mobilis);
});

$('#mobilis-start').on('change', function(){
  let mobilisNewIndex = mobilis.indexOf(this.value);
  mobilis = mobilis.rotate(mobilisNewIndex);
  paintCipherDisk(stabilis,mobilis);
});

function encryptMethod1(plaintext, stabilis, mobilis, digraphs) {
  plaintext = plaintext.toUpperCase();
  for(var i = 0; i < plaintext.length; i++){
    if(digraphs[plaintext[i]]){
      plaintext = plaintext.substr(0,i) + digraphs[plaintext[i]] + plaintext.substr(i+1);
    }
  }
  for(var i = 0; i < plaintext.length; i++){
    if(stabilis.indexOf(plaintext[i]) < 0){
      plaintext = plaintext.substr(0,i) + ' ' + plaintext.substr(i+1);
    }
  }

  $('#input-text').val(plaintext);

  let rotateCipher = parseInt($('#cipher-rotate').val());
  let outputText = stabilis[0];
  for(var i = 0; i < plaintext.length; i++){
    if(rotateCipher && (i !== 0) && (i%rotateCipher === 0)){
      let minRotation = 1;
      let maxRotation = stabilis.length-1;
      let newStabilisI = Math.floor(Math.random() * (maxRotation - minRotation + 1)) + minRotation;
      stabilis = stabilis.rotate(newStabilisI);
      outputText += stabilis[0];
      paintCipherDisk(stabilis,mobilis);
      updateStartSelectors(stabilis, mobilis);
    }
    if(plaintext[i] === ' '){
      outputText += ' ';
      continue;
    }
    outputText += mobilis[stabilis.indexOf(plaintext[i])];
  }
  $('#output-text').val(outputText);
}

function encryptMethod2(plaintext, stabilis, mobilis, digraphs) {
  plaintext = plaintext.toUpperCase();

  for(var i = 0; i < plaintext.length; i++){
    if(digraphs[plaintext[i]]){
      plaintext = plaintext.substr(0, i) + digraphs[plaintext[i]] + plaintext.substr(i + 1);
    }
  }

  for(var i = 0; i < plaintext.length; i++){
    if(stabilis.indexOf(plaintext[i]) < 0){
      plaintext = plaintext.substr(0, i) + ' ' + plaintext.substr(i + 1);
    }
  }

  $('#input-text').val(plaintext);

  let rotateCipher = parseInt($('#cipher-rotate').val());
  let outputText = mobilis[0]; // Inizia con il Mobilis Start

  for(var i = 0; i < plaintext.length; i++){
    if(rotateCipher && (i !== 0) && (i % rotateCipher === 0)){
      let minRotation = 1;
      let maxRotation = stabilis.length - 1;
      let newStabilisI = Math.floor(Math.random() * (maxRotation - minRotation + 1)) + minRotation;
      stabilis = stabilis.rotate(newStabilisI);
      outputText += stabilis[0];
      paintCipherDisk(stabilis, mobilis);
      updateStartSelectors(stabilis, mobilis);
    }

    if(plaintext[i] === ' '){
      outputText += ' ';
      continue;
    }

    outputText += mobilis[stabilis.indexOf(plaintext[i])];
  }

  $('#output-text').val(outputText);
}

$('#decipher').click(function () {
  let ciphertext = $('#input-text').val(); // Usa il testo cifrato presente in input
  let encryptionMethod = $("input[name='encryption-method']:checked").val();

  if (encryptionMethod === 'Method 1') {
    decryptMethod1(ciphertext, stabilis, mobilis, digraphs);
  } else if (encryptionMethod === 'Method 2') {
    decryptMethod2(ciphertext, stabilis, mobilis, digraphs);
  }
});


function rotate(array, numRotations) {
  return array.slice(numRotations).concat(array.slice(0, numRotations));
}

function decryptMethod1(ciphertext, stabilis, mobilis, digraphs) {
  let outputText = '';
  let rotationIndices = {}; // Mappa per tenere traccia degli indici delle lettere maiuscole

  for (var i = 0; i < ciphertext.length; i++) {
    if (ciphertext[i] === ' ') {
      outputText += ' ';
      continue;
    }

    let char = ciphertext[i];
    let isUpperCase = char === char.toUpperCase();

    if (isUpperCase && !(char in rotationIndices)) {
      // Se è una lettera maiuscola e non è stata già incontrata,
      // imposta l'indice della lettera maiuscola come l'indice corrente in stabilis
      rotationIndices[char] = stabilis.indexOf(char);
    }

    if (isUpperCase) {
      // Ruota stabilis in modo che la lettera maiuscola corrente sia la prima
      stabilis = rotate(stabilis, stabilis.indexOf(char));
      paintCipherDisk(stabilis, mobilis);
      updateStartSelectors(stabilis, mobilis);

      // Aggiungi la lettera maiuscola invariata all'output
      outputText += char;
    } else {
      let indexInMobilis = mobilis.indexOf(char.toLowerCase());

      if (indexInMobilis !== -1) {
        // Utilizza l'indice del mobilis
        outputText += stabilis[indexInMobilis];
      } else {
        // Mantieni invariata la lettera maiuscola
        outputText += char;
      }
    }
  }

  // Reverse the digraph substitution
  for (var key in digraphs) {
    if (digraphs.hasOwnProperty(key)) {
      outputText = outputText.replace(new RegExp(digraphs[key], 'g'), key);
    }
  }

  $('#output-text').val(outputText);
}





function decryptMethod2(ciphertext, stabilis, mobilis, digraphs) {
  let rotateCipher = parseInt($('#cipher-rotate').val());
  let outputText = '';

  for (var i = 0; i < ciphertext.length; i++) {
    if (rotateCipher && (i !== 0) && (i % rotateCipher === 0)) {
      let minRotation = 1;
      let maxRotation = stabilis.length - 1;
      let newStabilisI = Math.floor(Math.random() * (maxRotation - minRotation + 1)) + minRotation;
      stabilis = rotate(stabilis, newStabilisI);
      paintCipherDisk(stabilis, mobilis);
      updateStartSelectors(stabilis, mobilis);
    }

    if (ciphertext[i] === ' ') {
      outputText += ' ';
      continue;
    }

    outputText += stabilis[mobilis.indexOf(ciphertext[i])];
  }

  // Reverse the digraph substitution
  for (var key in digraphs) {
    if (digraphs.hasOwnProperty(key)) {
      outputText = outputText.replace(new RegExp(digraphs[key], 'g'), key);
    }
  }

  $('#output-text').val(outputText);
}
