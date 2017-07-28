# Registration Service

Angular 1.x doesn't allow do register later directives & co. in a module in the direct way.
Qlik introduced qvangular, but we like to be not bouded to that layer.
This is the reason the introduced this service, so that we can initialize in Qlik Extension
use cases the service with qvangular and in only angular use cases with the $compileProvider.

## Examples

### Qlik Extension

```
qvangular
  .service<IRegistrationProvider>("$registrationProvider", RegistrationProvider)
  .implementObject(qvangular);
```

### angular website

tbd
