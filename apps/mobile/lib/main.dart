import 'package:flutter/material.dart';

void main() {
  runApp(const CorvynApp());
}

class CorvynApp extends StatelessWidget {
  const CorvynApp({super.key});

  @override
  Widget build(BuildContext context) {
    return MaterialApp(
      title: 'Corvyn',
      theme: ThemeData(
        colorScheme: ColorScheme.fromSeed(seedColor: Colors.indigo),
        useMaterial3: true,
      ),
      home: const _BootstrapPage(),
    );
  }
}

class _BootstrapPage extends StatelessWidget {
  const _BootstrapPage();

  @override
  Widget build(BuildContext context) {
    return const Scaffold(
      body: Center(
        child: Text('Corvyn'),
      ),
    );
  }
}
