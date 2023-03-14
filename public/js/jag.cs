//Overloaded methods to find the area of triangle - Lab B2

using System;

namespace CSharp
{
	public class TriangleArea
	{
		public static void Main()
		{
			int opt;
			float lengthSide1, lengthSide2, lengthSide3, triangleBase, triangleHeight, triangleArea;
			//Be careful "base" is keyword in C#.
			TriangleArea obj = new TriangleArea();
			while(true)
			{
				Console.WriteLine("\n\nTo find Area of Triangle when...");
				Console.WriteLine("\t1. BASE and HEIGHT values are given");
				Console.WriteLine("\t2. Length of three sides are given");
				Console.WriteLine("\t3. Length of one of its sides is given");
				Console.WriteLine("\t4. Exit");
				Console.WriteLine("\nMark your option...");
				opt = Convert.ToInt32(Console.ReadLine());
				switch(opt)
				{
					case 1: 
						Console.WriteLine("Base? ");
						triangleBase = (float) Convert.ToDouble(Console.ReadLine());
						Console.WriteLine("Height? ");
						triangleHeight = (float) Convert.ToDouble(Console.ReadLine());
						triangleArea = obj.getTriangleArea(triangleBase, triangleHeight);
						Console.WriteLine("Area of the triangle with base: " + triangleBase + 
				                  " and height: " + triangleHeight + " is: "+triangleArea);
						break;					
					case 2:
						Console.WriteLine("Length of side 1? ");
						lengthSide1 = (float) Convert.ToDouble(Console.ReadLine());
						Console.WriteLine("Length of side 2? ");
						lengthSide2 = (float) Convert.ToDouble(Console.ReadLine());
						Console.WriteLine("Length of side 3? ");
						lengthSide3 = (float) Convert.ToDouble(Console.ReadLine());
						triangleArea = obj.getTriangleArea(lengthSide1, lengthSide2, lengthSide3);
						Console.WriteLine("Area of the triangle with length of side 1: " + lengthSide1 + 
				                  " lenght of side 2: " + lengthSide2 + " and length of side 3: " + lengthSide3 + 
				                  " is: "+triangleArea);
						break;
					case 3:
						Console.WriteLine("Length of one of the sides of the triangle? ");
						lengthSide1 = (float) Convert.ToDouble(Console.ReadLine());
						triangleArea = obj.getTriangleArea(lengthSide1);
						Console.WriteLine("Area of the triangle with length of one of its sides: " + lengthSide1 + 
				                  " is: "+triangleArea);
						break;				
					case 4:
						Environment.Exit(0);
						break;
					default:
						Console.WriteLine("Invalid Option...");
						break;
				}
				Console.Write("Press any Key to Continue...");
				Console.ReadKey();
				Console.Clear();
			}
		}
		
		float getTriangleArea(float tbase, float theight)
		{
			return((1/2.0f)*tbase*theight);
		}
		
		float getTriangleArea(float a, float b, float  c)
		{
			double s = (1/2.0f)*(a+b+c);
			float area = (float)Math.Sqrt(s*(s-a)*(s-b)*(s-c));   //
			return(area);
		}
		
		float getTriangleArea(float s)
		{
			float area = (float)((s*s) * (Math.Sqrt(3.0)/4.0));
			return (area);
		}
	}
}


