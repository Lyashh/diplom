import dictionary from "./dict";
import decl from "./decl";

const unique = ["nebo", "oko", "uho", "děte", "člověk"];

export const main = (word) => {
  const checkUnique = unique.some((uniqueWord) => {
    return word === uniqueWord;
  });

  let uniqueResult = null;
  if (checkUnique) {
    decl.map((el) => {
      el.ends.map((item) => {
        item.end_key.map((end) => {
          if (end == word) {
            uniqueResult = item;
            uniqueResult.sg = el.sg;
            uniqueResult.pl = el.pl;
            uniqueResult.origin_beginning = " ";
            uniqueResult.origin_end = " ";
          }
        });
      });
    });
    return { success: true, body: uniqueResult };
  } else {
    const index = dictionary.findIndex((e) => e.word === word);
    if (index >= 0) {
      const findWord = dictionary[index]; //word and its type

      //находим по гендеру
      const findDecl = decl.filter((el, i) => {
        return findWord.type == el.gender;
      })[0];

      const correctEnd = find(word, findDecl);

      if (findDecl) {
        if (findDecl.gender == "indecl.") {
          const indeclItem = {
            indexOfEnd: 0,
            sg: true,
            pl: true,
            nom_sg: { body: " " },
            acc_sg: { body: "" },
            gen_sg: { body: "" },
            dat_sg: { body: "" },
            ins_sg: { body: "" },
            loc_sg: { body: "" },
            voc_sg: { body: "" },

            nom_pl: { body: "" },
            acc_pl: { body: "" },
            gen_pl: { body: " " },
            dat_pl: { body: "" },
            ins_pl: { body: "" },
            loc_pl: { body: "" },
            voc_pl: { body: "" },
            origin_beginning: word,
            origin_end: " ",
          };
          return { success: true, body: indeclItem };
        }

        if (!correctEnd) {
          return {
            success: false,
            body: "Dont find correct end",
          };
        }

        return { success: true, body: correctEnd };
      } else {
        return {
          success: false,
          body: "Dont find correct gender",
        };
      }
    } else {
      return { success: false, body: "Cant find word" };
    }
  }
};

const find = (word, findDecl) => {
  for (let index = 5; index > 0; index--) {
    if (word.length + 1 > index) {
      //корень при длинне index

      let original = word.substr(0, word.length - index);
      //окончание при длинне index
      let end = word.substr(-index);
      let indexOfEnd = null;
      let findItem = findDecl.ends.filter((el, i) => {
        return el.end_key.some((declEnd) => {
          if (end.trim() == declEnd.trim()) {
            indexOfEnd = i;
          }
          return end.trim() == declEnd.trim();
        });
      })[0];

      if (findItem) {
        return {
          groupEnds: findDecl.ends[indexOfEnd],
          ...findItem,
          indexOfEnd,
          origin_beginning: word.substr(0, word.length - index),
          origin_end: word.substr(-index),
          sg: findDecl.sg,
          pl: findDecl.pl,
        };
      }
    }
  }
};
