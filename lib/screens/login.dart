import 'package:docsclone/colors.dart';
import 'package:docsclone/repository/auth.dart';
import 'package:flutter/material.dart';
import 'package:flutter_riverpod/flutter_riverpod.dart';
import 'package:routemaster/routemaster.dart';

class LoginScreen extends ConsumerWidget {
  const LoginScreen({Key? key}) : super(key: key);
  void signInWithGoogle(WidgetRef ref, BuildContext context)async{
  final sMessenger = ScaffoldMessenger.of(context);
    final navigator = Routemaster.of(context);
    final errorModel =
        await ref.read(authRepositoryProvider).signInWithGoogle();
      if (errorModel.error == null) {
      ref.read(userProvider.notifier).update((state) => errorModel.data);
      navigator.replace("/");
    } else {
      sMessenger.showSnackBar(
        SnackBar(
          content: Text(errorModel.error!),
        ),
      );
    }
  }
  @override
  Widget build(BuildContext context,WidgetRef ref) {
    return Scaffold(
      body: Center(
        child: ElevatedButton.icon(
          onPressed: () => signInWithGoogle(ref,context),
          icon: Image.asset("assets/images/2.png",height: 20,),
          label: const Text("Login with google"),
          style: ElevatedButton.styleFrom(
            backgroundColor: kBlackColor,
            minimumSize: const Size(150, 50),
          ),
        ),
      ),
    );
  }
}
