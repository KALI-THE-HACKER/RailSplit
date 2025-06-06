import 'package:flutter/material.dart';
import 'package:google_fonts/google_fonts.dart';

void main() {
  runApp(const MyApp());
}

class MyApp extends StatelessWidget {
  const MyApp({super.key});

  // This widget is the root of your application.
  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: "RailSplit",
      debugShowCheckedModeBanner: false,
      themeMode: ThemeMode.dark,
        darkTheme: ThemeData(
          brightness: Brightness.dark,
          appBarTheme: AppBarTheme(
            backgroundColor: Color.fromRGBO(40,43,50, 1), 
            foregroundColor: const Color.fromARGB(255, 255, 255, 255),     // for icons and title
            elevation: 0,
          ),
          scaffoldBackgroundColor: Color(0xFF010101),
          primaryColor: Color(0xFF2475EE), // Brand primary (blue)
          cardColor: Color(0xFF1D1F24), // Card BG

          textTheme: TextTheme(
            bodyLarge: TextStyle(color: Color(0xFFFFFFFF)), // White
            bodyMedium: TextStyle(color: Color(0xFF9A9A9A)), // Light grey
            labelMedium: TextStyle(color: Color(0xFF676767)), // Labels
          ),

          inputDecorationTheme: InputDecorationTheme(
            filled: true,
            fillColor: Color(0xFF282B32), // Input field background
            hintStyle: TextStyle(color: Color(0xFF3A3F49)), // Placeholder
            border: OutlineInputBorder(
              borderRadius: BorderRadius.circular(12),
              borderSide: BorderSide.none,
            ),
          ),

          elevatedButtonTheme: ElevatedButtonThemeData(
            style: ElevatedButton.styleFrom(
              backgroundColor: Color(0xFF2475EE),
              foregroundColor: Colors.white,
              shape: RoundedRectangleBorder(
                borderRadius: BorderRadius.circular(12),
              ),
            ),
          ),

          checkboxTheme: CheckboxThemeData(
            fillColor: MaterialStateProperty.all(Color(0xFF2475EE)),
          )),


      home: const MyHomePage(title: 'RailSplit'),
    );
  }
}

class MyHomePage extends StatefulWidget {
  const MyHomePage({super.key, required this.title});

  final String title;

  @override
  State<MyHomePage> createState() => _MyHomePageState();
}

class _MyHomePageState extends State<MyHomePage> {

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Center(child: Text("RailSplit", style: GoogleFonts.openSans(fontWeight: FontWeight.w700, wordSpacing: 16.1))),
      ),
      body: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: <Widget>[
            Container(
              decoration: 
              BoxDecoration(
                border: Border.all(
                  width: 20
                ),
                borderRadius: BorderRadius.circular(20)),
                
              child: const Text(
                'You have pushed the button this many times:', style: TextStyle(color: Colors.white),))
          ],
        ),
      ) // This trailing comma makes auto-formatting nicer for build methods.
    );
  }
}
