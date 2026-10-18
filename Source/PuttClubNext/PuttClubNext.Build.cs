using UnrealBuildTool;

public class PuttClubNext : ModuleRules
{
    public PuttClubNext(ReadOnlyTargetRules Target) : base(Target)
    {
        PCHUsage = PCHUsageMode.UseExplicitOrSharedPCHs;
        PublicDependencyModuleNames.AddRange(new string[]
        {
            "Core", "CoreUObject", "Engine", "InputCore", "EnhancedInput",
            "GameplayCameras", "UMG", "Slate", "SlateCore"
        });
        PrivateDependencyModuleNames.AddRange(new string[] { });
    }
}
