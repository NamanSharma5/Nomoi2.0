var records = [
    { id: 1, username: 'Naman', password: '1amadmin!', displayName: 'Naman', emails: [ { value: 'Naman@example.com' } ] }
  , { id: 2, username: 'Shashi', password: 'Langley85099', displayName: 'Shashi', emails: [ { value: 'n/a' } ] } //
  , { id: 3, username: 'Guy', password: 'White96!', displayName: 'Guy', emails: [ { value: '16guyw@harrowschool.org.uk' } ] }
  , { id: 4, username: 'Billy', password: 'LP12!', displayName: 'Billy', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 5, username: 'Yujin', password: 'Koshiba69!', displayName: 'Yujin', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 6, username: 'Graham', password: 'Lambert14!', displayName: 'Graham', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 7, username: 'Edward', password: 'Pagani99!', displayName: 'Edward', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 8, username: 'Jake', password: 'Ramus10!', displayName: 'Jake', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 9, username: 'Henry', password: 'Oelhalfen33!', displayName: 'Henry', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 10, username: 'George', password: 'Townshend50!', displayName: 'George', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 11, username: 'Tito', password: 'Edjua43!', displayName: 'Tito', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 12, username: 'Marcos', password: 'Kantaris77!', displayName: 'Marcos', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 13, username: 'William', password: 'TP87!', displayName: 'William', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 14, username: 'DJ', password: 'Banda11!', displayName: 'DJ', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 15, username: 'Maahir', password: 'Puri70!', displayName: 'Maahir', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 16, username: 'Finn', password: 'Teepsuwan03!', displayName: 'Finn', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 17, username: 'Ed', password: 'Blunt00!', displayName: 'Ed', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 18, username: 'HenryH', password: 'Hancock08!', displayName: 'Henry', emails: [ { value: '@harrowschool.org.uk' } ] } // Actually in Elmfield
  , { id: 19, username: 'Yoh', password: 'Ishikawa32!', displayName: 'Yoh', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 20, username: 'Justin', password: 'Lam78!', displayName: 'Justin', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 21, username: 'Dante', password: 'Doros99!', displayName: 'Dante', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 22, username: 'Rei', password: 'Ishikawa43!', displayName: 'Rei', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 23, username: 'Tobi', password: 'Olorode15!', displayName: 'Tobi', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 24, username: 'AlexK', password: 'Saunders12!', displayName: 'Alex', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 25, username: 'HarryK', password: 'Saunders53!', displayName: 'Harry', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 26, username: 'HenryK', password: 'Arundell20!', displayName: 'Arundell', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 27, username: 'Sampda', password: 'Sharma14!', displayName: 'Sampda', emails: [ { value: '@harrowschool.org.uk' } ] } //sam
  , { id: 28, username: 'WillK', password: 'Tate11!', displayName: 'Will', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 29, username: 'EnzoK', password: 'Nakornsri49!', displayName: 'Enzo', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 30, username: 'HenryE', password: 'Wilson69!', displayName: 'Henry', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 31, username: 'AlexM', password: 'Lee62!', displayName: 'Alex', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 32, username: 'AaravM', password: 'Tribhuvan87!', displayName: 'Aarav', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 33, username: 'HenryM', password: 'Rowntree33!', displayName: 'Henry', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 34, username: 'VictorM', password: 'Grant42!', displayName: 'Victor', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 35, username: 'TobiM', password: 'Amusan21!', displayName: 'Tobi', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 36, username: 'AlgieM', password: 'Anderson30!', displayName: 'Algie', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 37, username: 'ValentineM', password: 'Ballingal56!', displayName: 'Valentine', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 38, username: 'HarryM', password: 'Burt99!', displayName: 'Harry', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 39, username: 'RobertM', password: 'Oldman60!', displayName: 'Robert', emails: [ { value: '@harrowschool.org.uk' } ] } //
  , { id: 40, username: 'TomiwaM', password: 'Oyegade88!', displayName: 'Tomiwa', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 41, username: 'SamM', password: 'Phillips55!', displayName: 'Sam', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 42, username: 'AaronM', password: 'Sohal14!', displayName: 'Aaron', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 43, username: 'jaideep9897', password: 'Puri78!', displayName: 'Jaideep', emails: [ { value: '@harrowschool.org.uk' } ] } //
  , { id: 44, username: 'FreddieP', password: 'Murley98!', displayName: 'Freddie', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 45, username: 'RenukaM', password: 'Tribhuvan87!', displayName: 'Renuka', emails: [ { value: '@harrowschool.org.uk' } ] } //
  , { id: 46, username: 'IanR', password: 'Gethin52!', displayName: 'Ian', emails: [ { value: '@harrowschool.org.uk' } ] } //
  , { id: 47, username: '17jariwalap@harrowschool.org.uk', password: 'Jariwala59!', displayName: 'Pahal', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 48, username: '18doughtys@harrowschool.org.uk ', password: 'Doughty74!', displayName: 'Sean', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 49, username: '18ellisc@harrowschool.org.uk', password: 'Ellis69!', displayName: 'Cameron', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 50, username: '18owensj@harrowschool.org.uk', password: 'Owens23!', displayName: 'Josh', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 51, username: '18PoundS@harrowschool.org.uk', password: 'Pound56!', displayName: 'Sam', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 52, username: '19codringtonj@harrowschool.org.uk', password: 'Codrington93!', displayName: 'Johnny', emails: [ { value: '@harrowschool.org.uk' } ] } 
  , { id: 53, username: '19dinanf@harrowschool.org.uk', password: 'Dinan20!', displayName: 'Freddie', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 54, username: '19gethinj@harrowschool.org.uk', password: 'Gethin52!', displayName: 'Joe', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 55, username: '19gleasone@harrowschool.org.uk', password: 'Gleason66!', displayName: 'Ewan', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 56, username: '17wilsona@harrowschool.org.uk', password: 'Wilson64!', displayName: 'Adam', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 57, username: '18taylore@harrowschool.org.uk', password: 'Taylor34!', displayName: 'Elliot', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 58, username: '19higuchim@harrowschool.org.uk', password: 'Higuchi20!', displayName: 'Masato', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 59, username: '19wrightw@harrowschool.org.uk', password: 'Wright89!', displayName: 'William', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 60, username: '19chauc@harrowschool.org.uk', password: 'Chau10!', displayName: 'Hymn', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 61, username: '18LordL@harrowschool.org.uk', password: 'Lord29!', displayName: 'Louis', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 62, username: '18obatoyinbob@harrowschool.org.uk', password: 'Obatoyinbo14!', displayName: 'Baba', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 63, username: '19taylorb@harrowschool.org.uk', password: 'Taylor34!', displayName: 'Ben', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 64, username: '15chenj@harrowschool.org.uk', password: 'Chen69!', displayName: 'Jack', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 65, username: '19emusd@harrowschool.org.uk', password: 'Emus23!', displayName: 'Digby', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 66, username: '15khant@harrowschool.org.uk', password: 'Khan30!', displayName: 'Tom', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 67, username: '18HargravesA@harrowschool.org.uk', password: 'Hargraves29!', displayName: 'Aiden', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 68, username: '17fergusong@harrowschool.org.uk', password: 'Ferguson59!', displayName: 'George', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 69, username: '17taylorf@harrowschool.org.uk', password: 'Taylor45!', displayName: 'Freddie', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 70, username: '18hobbst@harrowschool.org.uk', password: 'Hobbs78!', displayName: 'Thomas', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 71, username: '18morishigek@harrowschool.org.uk', password: 'Morishige89!', displayName: 'Kanta', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 72, username: '18smithc@harrowschool.org.uk', password: 'Smith49!', displayName: 'Cooper', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 73, username: '19childsc@harrowschool.org.uk', password: 'Childs10!', displayName: 'Cam', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 74, username: '19finchn@harrowschool.org.uk', password: 'Finch13!', displayName: 'Nick', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 75, username: '19smiths@harrowschool.org.uk', password: 'Smith99!', displayName: 'St John', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 76, username: '18adomakoha@harrowschool.org.uk', password: 'Adomakoh58!', displayName: 'Barimah', emails: [ { value: '@harrowschool.org.uk' } ] } 
  , { id: 77, username: '17andersonh@harrowschool.org.uk', password: 'Anderson23!', displayName: 'Hugo', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 78, username: '18kolawoleo@harrowschool.org.uk', password: 'Kolawole30!', displayName: 'Bode', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 79, username: '19strattona@harrowschool.org.uk', password: 'Anderson23!', displayName: 'Andrew', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 80, username: 'dadomakoh@gmail.com', password: 'Adomakoh58!', displayName: 'David', emails: [ { value: '@harrowschool.org.uk' } ] } //
  , { id: 81, username: '17chiimbam@harrowschool.org.uk', password: 'Chiimba80!', displayName: 'Michael', emails: [ { value: '@harrowschool.org.uk' } ] }
  , { id: 82, username: 'teresa@dinanhome.co.uk', password: 'Dinan20!', displayName: 'Teresa', emails: [ { value: '@harrowschool.org.uk' } ] }
    
  
];

exports.findById = function(id, cb) {
  process.nextTick(function() {
    var idx = id - 1;
    if (records[idx]) {
      cb(null, records[idx]);
    } else {
      cb(new Error('User ' + id + ' does not exist'));
    } 
  });
}

exports.findByUsername = function(username, cb) {
  process.nextTick(function() {
    for (var i = 0, len = records.length; i < len; i++) {
      var record = records[i];
      if (record.username === username) {
        return cb(null, record);
      }
    }
    return cb(null, null);
  });
}
