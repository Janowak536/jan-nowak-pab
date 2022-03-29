
import express from "express";
import { notStrictEqual } from "assert";
import { Request, Response } from "express";
import { write } from "fs";
import { title } from "process";

function Read(): void {
  var fs = require("fs");
  var data = fs.readFileSync('./data/notatka.json');
  var words = JSON.parse(data);
  console.log(words);
  
}

function Write(): void {
  var fs = require("fs");
  fs.writeFileSync('./data/notatka.json', JSON.stringify(notatka));
}

const app = express()

app.use(express.json())

app.get('/', function (req: Request, res: Response) {
  res.send('GET Hello World')
})
app.post('/', function (req: Request, res: Response) {
  console.log(req.body) 
  res.status(200).send('POST Hello World')
})


interface Note {
  title: string;
  content: string;
  createDate?: string;
  tags?: any[];
  id?: number;
}
interface Tag {
  id?: number;
  name: string;
}

let tags: Tag[] = [];
let notatka: Note[] = [];


app.get("/tags", function (req, res) {
  res.send(tags);
});

app.post("/tag", function (req, res) {
  if (req.body.name) {
    const name = req.body.name.toLowerCase();
    var a = name.toLowerCase();

    const tagFind = tags.find((name) => name.name === a);

    if (tagFind) {
      res.status(404).send("Błąd 404");
    } else {
      let tag: Tag = {
        name: req.body.name,
        id: Date.now(),
      };
      tags.push(tag);
      res.status(200).send(tag);
    }
  } else {
    res.status(404).send("Błąd 404");
  }
});

app.delete("/tag/:id", function (req, res) {
  const { id } = req.params;
  const ID = +id;
  tags = tags.filter((tag) => tag.id !== ID);
  res.send("tag usunięty");
});

app.put("/tag/:id", function (req, res) {
  const { id } = req.params;
  const ID = +id;
  const name = req.body.name;

  name.toLowerCase();

  const tag = tags.find((note) => note.id === ID);

  if (name) {
    tag!.name = name;
  }
  res.send(tag);
});


app.get("/note/:id", function (req: Request, res: Response) {
  const title = req.body.title;
  const content = req.body.content;

  var ID = req.params.id;
  const IDnumber = +ID;

  for (const item of notatka) {
    if (item.id == IDnumber && ID != null) {
      res.status(200).send(item);
    } else {
      res.status(404).send("Błąd 404");
    }
  }
});

app.get("/notes", function (req: Request, res: Response) {
  Read();
  res.send(notatka);
  
});

app.post("/note", function (req: Request, res: Response) {
  Read();
  if (req.body.title && req.body.content) {

    let note: Note = {
      title: req.body.title,
      content: req.body.content,
      createDate: new Date().toISOString(),
      tags: req.body.tags,
      id: Date.now(),
    };

    let tag: Tag = {
      id: Date.now(),
      name: req.body.tags
    };

    var idToString = note.id!.toString();

    if(tag.name===undefined){
      tag = {
        id :Date.now(),
        name: "Default"
      }
    }

    const name = tag.name.toString().toLowerCase();

    let tagNameToLowerCase = name.toLowerCase();

    const tagFind = tags.find((x) => x.name === tagNameToLowerCase);

    if (tagFind||tagNameToLowerCase==="default") {
      notatka.push(note);
      Write();
    }
    else {
      tags.push(tag)
      notatka.push(note);    
      Write();
    }
    res.status(200).send(idToString);
  }
  else {
    res.status(404).send("Błąd 404");
  }
});



app.delete("/note/:id", (req, res) => {
  Read();
  const { id } = req.params;
  const ID = +id;

  notatka = notatka.filter((note) => note.id !== ID);
  Write();
  res.send("Delete");
});
app.put("/note/:id", (req, res) => {
  Read();
  const { id } = req.params;
  const ID = +id;

  const { title, content, createDate, tags } = req.body;

  const note = notatka.find((note) => note.id === ID);
  if (note == null) {
    res.status(404).send("błąd 404")
  }else{
    function validateToken(note: any) {
      return note;
    }
  
    validateToken(note as any);
  
    if (title) {
      note!.title = title;
    }
  
    if (content) {
      note!.content = content;
    }
  
    if (createDate) {
      note!.createDate = createDate;
    }
  
    if (tags) {
      note!.tags = tags;
    }
  
    res.send(note);
    Write()
  }
});
app.listen(3000)