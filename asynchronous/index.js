const fs = require('fs');
const superagent = require('superagent');

// fs.readFile(`${__dirname}/dog.txt`, (err, data) => {
//   console.log(`Breed: ${data}`);

//   superagent
//     .get(`https://dog.ceo/api/breed/${data}/images/random`)
//     .then((res) => {
//       console.log(res.body.message);

//       fs.writeFile('dog-img.txt', res.body.message, (err) => {
//         console.log(err);
//       });
//     })
//     .catch((err) => console.log(err));
// });

const readFilePro = (file) => {
  return new Promise((resolve, reject) => {
    fs.readFile(file, (err, data) => {
      if (err) reject('Handling error');
      resolve(data);
    });
  });
};

const writeFilePro = (file, data) => {
  return new Promise((resolve, reject) => {
    fs.writeFile(file, data, (err) => {
      if (err) reject('Error in write file');
      resolve('Write file successfully');
    });
  });
};

// readFilePro(`${__dirname}/dog.txt`)
//   .then((data) => {
//     console.log(`Breed: ${data}`);

//     return superagent.get(`https://dog.ceo/api/breed/${data}/images/random`);
//   })
//   .then((res) => {
//     console.log(res.body.message);

//     return writeFilePro('dog-img.txt', res.body.message);
//   })
//   .then(() => console.log('Random dog image saved to file!'))
//   .catch((err) => console.log(err));

// const getDogPic = async () => {
//   try {
//     const data = await readFilePro(`${__dirname}/dog.txt`);
//     console.log(`Breed: ${data}`);

//     const res = await superagent.get(
//       `https://dog.ceo/api/breed/${data}/images/random`
//     );
//     console.log(res.body.message);

//     await writeFilePro(`${__dirname}/dog-img.txt`, res.body.message);
//     console.log('Random dog image saved to file!');
//   } catch (err) {
//     console.log(err);
//     throw err;
//   }
//   return '2';
// };

// console.log('1');
// getDogPic()
//   .then((x) => {
//     console.log(x);
//     console.log('3');
//   })
//   .catch((err) => console.log('Error: ', err));

// (async () => {
//   try {
//     console.log('1');
//     const x = await getDogPic();
//     console.log(x);
//     console.log('3');
//   } catch (err) {
//     console.log('ERROR: ', err);
//   }
// })();

const getDogPics = async () => {
  try {
    const data = await readFilePro(`${__dirname}/dog.txt`);
    console.log(`Breed: ${data}`);

    const res1 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res2 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );
    const res3 = superagent.get(
      `https://dog.ceo/api/breed/${data}/images/random`
    );

    const all = await Promise.all([res1, res2, res3]);

    all.forEach((res) => console.log(res.body.message));

    await writeFilePro(
      `${__dirname}/dog-img.txt`,
      all.map((res) => res.body.message).join('\n')
    );
    console.log('Random dog image saved to file!');
  } catch (err) {
    console.log(err);
    throw err;
  }
  return '2';
};

(async () => {
  try {
    console.log('1');
    const x = await getDogPics();
    console.log(x);
    console.log('3');
  } catch (err) {
    console.log('ERROR: ', err);
  }
})();
