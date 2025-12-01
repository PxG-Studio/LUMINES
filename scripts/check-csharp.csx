#!/usr/bin/env dotnet-script
// C# Syntax Validation Script for WISSIL
// Validates generated C# code from Ignis Blueprint Editor

using System;
using System.IO;
using System.Text.RegularExpressions;

// Check for common C# syntax issues in generated code
var issues = new List<string>();

// Read generated C# file (would be passed as argument in real usage)
var csharpCode = args.Length > 0 ? File.ReadAllText(args[0]) : "";

// Validate basic C# structure
if (!csharpCode.Contains("using UnityEngine"))
{
    issues.Add("Missing UnityEngine import");
}

if (!csharpCode.Contains("public class"))
{
    issues.Add("Missing public class declaration");
}

if (!csharpCode.Contains("MonoBehaviour"))
{
    issues.Add("Class must inherit from MonoBehaviour");
}

// Check for common syntax errors
if (csharpCode.Contains("void Start()") && !csharpCode.Contains("{"))
{
    issues.Add("Start method missing opening brace");
}

// Validate method structure
var methodPattern = @"void\s+\w+\s*\([^)]*\)\s*\{";
if (!Regex.IsMatch(csharpCode, methodPattern))
{
    issues.Add("Invalid method structure");
}

// Report issues
if (issues.Count > 0)
{
    Console.WriteLine("C# Validation Failed:");
    foreach (var issue in issues)
    {
        Console.WriteLine($"  - {issue}");
    }
    Environment.Exit(1);
}
else
{
    Console.WriteLine("C# code validation passed");
    Environment.Exit(0);
}

