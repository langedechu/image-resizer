/**
 ** Reads the first file in the "input" directory, resizes it to double its original size,
 ** and saves the result in the "output" directory with the same filename.
 */
import fs from "fs";
import { PNG } from "pngjs";

//? This reads the first file in the "input" directory and pipes it to the PNG parser.
fs.createReadStream(`input/${fs.readdirSync("input", "utf-8")[0]}`)
  .pipe(
    new PNG({
      filterType: 4,
    })
  )
  .on("parsed", function () {
    //? This is where you can modify the image data.
    const finalImage = new PNG({
      width: this.width * 2,
      height: this.height * 2,
    });

    //? I created two arrays to store the columns and rows of the image.
    var imageColumns = [];
    var imageRows = [];

    //? This loops through the image data and pushes the color values to the imageColumns array.
    for (var y = 0; y < this.height; y++) {
      for (var x = 0; x < this.width; x++) {
        //? This is the index of the current pixel in the image data array.
        const index = (this.width * y + x) << 2;

        //? These are the color values of the current pixel.
        const r = this.data[index];
        const g = this.data[index + 1];
        const b = this.data[index + 2];
        const a = this.data[index + 3];

        //? This pushes the color values to the imageColumns array.
        const color = [r, g, b, a];

        imageColumns.push(color);
        imageColumns.push(color);
      }

      //? This pushes the imageColumns array to the imageRows array and resets the imageColumns array.
      imageRows.push(imageColumns);
      imageRows.push(imageColumns);
      imageColumns = [];
    }

    //? This sets the final image data to the imageRows array.
    finalImage.data = Buffer.from(imageRows.flat(2));

    //? This pipes the final image to the "output" directory.
    finalImage
      .pack()
      .pipe(
        fs.createWriteStream(
          `output/${fs.readdirSync("input", "utf-8")[0]}.png`
        )
      );
  });
